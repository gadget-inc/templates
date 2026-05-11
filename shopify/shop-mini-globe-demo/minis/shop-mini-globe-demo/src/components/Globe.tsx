import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import { CITY_LABELS, makeCityLabelTexture } from "./globe/cities";
import { GreatCircleArcCurve, latLngToVector3 } from "./globe/geometry";

export type ArcOptions = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  /** Hex color, e.g. 0x4f46e5. Default indigo. */
  color?: number;
  /** Bezier control-point altitude as fraction of globe radius. Auto if omitted. */
  altitude?: number;
  /** Time spent drawing the arc, ms. Default 1500. */
  drawDurationMs?: number;
  /** Time the arc holds at full length before fading, ms. Default 1500. */
  holdDurationMs?: number;
  /** Fade-out time, ms. Pass 0 to make the arc permanent. Default 800. */
  fadeDurationMs?: number;
  /** Optional payload returned to onArcClick when the user taps this arc. */
  metadata?: unknown;
};

export type GlobeHandle = {
  /** Draw an arc; returns a cleanup function that removes it immediately. */
  addArc: (opts: ArcOptions) => () => void;
  /** Remove every active arc. */
  clearArcs: () => void;
  /** Smoothly rotate the globe so the great-circle midpoint of an arc faces
   *  the camera, and zoom in. */
  focusOnArc: (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    opts?: { zoom?: number; durationMs?: number }
  ) => void;
  /** Smoothly return the camera to the default zoom. Rotation stays where it is. */
  releaseView: (opts?: { durationMs?: number }) => void;
  /** Pause or resume the idle auto-rotation drift. */
  setAutoRotate: (enabled: boolean) => void;
};

interface GlobeProps {
  className?: string;
  /** Fired when the user touches the canvas (pointerdown). Useful for
   *  aborting host-driven animations (e.g. a path-tracing sequence). */
  onUserInteract?: () => void;
  /** Fired when the user taps an arc that has metadata attached. */
  onArcClick?: (metadata: unknown) => void;
}

const GLOBE_RADIUS = 0.8;

// Equirectangular land/water heightmap. Land is bright, water is dark.
const EARTH_LAND_MASK_URL =
  "https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-water.png";

const ARC_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ARC_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uColor;
  void main() {
    if (vUv.x > uProgress) discard;
    // Subtle brightening at the leading head while drawing.
    float head = smoothstep(uProgress - 0.04, uProgress, vUv.x) * step(uProgress, 0.999);
    vec3 col = uColor + vec3(head * 0.35);
    gl_FragColor = vec4(col, uOpacity);
  }
`;

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.65)");
    grad.addColorStop(0.55, "rgba(255,255,255,0.2)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(function Globe(
  { className, onUserInteract, onArcClick },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<GlobeHandle | null>(null);
  // Track latest callbacks via refs so the effect doesn't re-run.
  const onUserInteractRef = useRef(onUserInteract);
  onUserInteractRef.current = onUserInteract;
  const onArcClickRef = useRef(onArcClick);
  onArcClickRef.current = onArcClick;

  useImperativeHandle(
    ref,
    () => ({
      addArc: (opts) => apiRef.current?.addArc(opts) ?? (() => {}),
      clearArcs: () => apiRef.current?.clearArcs(),
      focusOnArc: (s, e, o) => apiRef.current?.focusOnArc(s, e, o),
      releaseView: (o) => apiRef.current?.releaseView(o),
      setAutoRotate: (en) => apiRef.current?.setAutoRotate(en),
    }),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dark globe sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0a12,
      emissive: 0x0a0a12,
      emissiveIntensity: 0.1,
      shininess: 8,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // Create land dots - GitHub style using pentagons
    const dotCount = 22000;
    const dotGeometry = new THREE.CircleGeometry(GLOBE_RADIUS * 0.006, 5);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.6,
    });

    const dots = new THREE.InstancedMesh(dotGeometry, dotMaterial, dotCount);
    const dummy = new THREE.Object3D();

    // Generate dots on a fibonacci sphere; keep each candidate's matrix + lat/lng
    // so we can filter to land-only once the mask image arrives.
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const surface = GLOBE_RADIUS * 1.002;

    type Candidate = { matrix: THREE.Matrix4; lat: number; lng: number };
    const candidates: Candidate[] = [];

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * ringRadius;
      const z = Math.sin(theta) * ringRadius;

      const px = x * surface;
      const py = y * surface;
      const pz = z * surface;

      dummy.position.set(px, py, pz);
      dummy.lookAt(px * 2, py * 2, pz * 2);
      dummy.updateMatrix();

      const lat = Math.asin(y) * (180 / Math.PI);
      const lng = Math.atan2(-z, x) * (180 / Math.PI);

      candidates.push({ matrix: dummy.matrix.clone(), lat, lng });
    }

    const showAll = () => {
      for (let i = 0; i < candidates.length; i++) {
        dots.setMatrixAt(i, candidates[i].matrix);
      }
      dots.count = candidates.length;
      dots.instanceMatrix.needsUpdate = true;
    };

    // Render every dot immediately so the globe is never empty. The land mask
    // load only collapses this set to land-only on success.
    showAll();
    globeGroup.add(dots);

    const collapseToLand = (img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("[Globe] no 2d context for land mask");
        return;
      }
      try {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const w = canvas.width;
        const h = canvas.height;
        const sampleBrightness = (cx: number, cy: number) => {
          let sum = 0;
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const x = Math.min(w - 1, Math.max(0, cx + dx));
              const y = Math.min(h - 1, Math.max(0, cy + dy));
              const i = (y * w + x) * 4;
              sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
              count++;
            }
          }
          return sum / count;
        };

        let landIndex = 0;
        for (const c of candidates) {
          const u = (c.lng + 180) / 360;
          const v = (90 - c.lat) / 180;
          const cx = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
          const cy = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
          // earth-water.png: water = bright, land = dark.
          if (sampleBrightness(cx, cy) < 90) {
            dots.setMatrixAt(landIndex, c.matrix);
            landIndex++;
          }
        }
        if (landIndex === 0) {
          console.warn("[Globe] land mask matched 0 dots; keeping full sphere");
          showAll();
          return;
        }
        dots.count = landIndex;
        dots.instanceMatrix.needsUpdate = true;
        console.log(`[Globe] land mask applied, ${landIndex} dots`);
      } catch (err) {
        console.warn("[Globe] land mask read failed (CORS?):", err);
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => collapseToLand(img);
    img.onerror = (err) => {
      console.warn("[Globe] land mask failed to load:", err);
    };
    img.src = EARTH_LAND_MASK_URL;

    // Create atmosphere halo - GitHub style
    // Using a gradient on backside of sphere with additive blending
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Calculate intensity based on view angle
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.31, 0.27, 0.9, intensity * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64),
      atmosphereMaterial,
    );
    atmosphere.rotateX(Math.PI * 0.03);
    atmosphere.rotateY(Math.PI * 0.03);
    scene.add(atmosphere);

    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.18,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
      }),
    );
    scene.add(stars);

    // GitHub-style 4-point lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0x6366f1, 0.8);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 0.5);
    rimLight.position.set(4, -1, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.3);
    fillLight.position.set(2, -2, -3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x4f46e5, 0.4);
    backLight.position.set(0, 3, -4);
    scene.add(backLight);

    // Drag + pinch interaction
    const ZOOM_MIN = 1.4;
    const ZOOM_MAX = 6;
    const PITCH_LIMIT = Math.PI * 0.45; // ~81°, prevents flipping past the pole
    const IDLE_YAW_VEL = 0.0015;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    // Globe orientation is fully described by yaw (rotation around world Y,
    // for longitude pan) and pitch (rotation around world X, for latitude pan).
    // The quaternion is rebuilt from these two scalars every frame, so they
    // never tumble into each other regardless of how a focus tween lands.
    let yaw = 0;
    let pitch = 0;
    let velocityX = IDLE_YAW_VEL; // yaw delta per frame
    let velocityY = 0; // pitch delta per frame
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchBaseDist = 0;
    let pinchBaseZ = 0;
    // True when the user touches the canvas during an active focus tween.
    // Used to decide whether to auto-release the camera on pointer-up.
    let userInterruptedFocus = false;
    // Tap detection: track the initial pointer-down position/time, mark the
    // gesture as "no longer a tap candidate" once movement exceeds a small
    // threshold or a second pointer comes down.
    const TAP_MAX_MOVE_PX = 6;
    const TAP_MAX_DURATION_MS = 350;
    let tapStartX = 0;
    let tapStartY = 0;
    let tapStartTimeMs = 0;
    let isTapCandidate = false;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const handleArcTap = (clientX: number, clientY: number) => {
      const cb = onArcClickRef.current;
      if (!cb) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      // Only tappable arcs participate in hit testing.
      const tappableMeshes: THREE.Object3D[] = [];
      for (const a of arcs) {
        if (a.metadata !== undefined) tappableMeshes.push(a.arcMesh);
      }
      if (tappableMeshes.length === 0) return;
      const hits = raycaster.intersectObjects(tappableMeshes, false);
      if (hits.length === 0) return;
      const hit = arcs.find((a) => a.arcMesh === hits[0].object);
      if (hit?.metadata !== undefined) cb(hit.metadata);
    };

    const pinchDistance = () => {
      const pts = Array.from(pointers.values());
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    };

    const clampZ = (z: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      renderer.domElement.setPointerCapture(e.pointerId);
      // User interaction always cancels any in-flight focus tween. If a focus
      // was actually active, mark it so we auto-release on pointer-up.
      if (focusState) userInterruptedFocus = true;
      focusState = null;
      // Notify the host (e.g. to abort a path-tracing sequence).
      onUserInteractRef.current?.();
      if (pointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        // Begin tracking a possible tap. A second pointer or significant
        // movement will invalidate the candidate before pointer-up.
        tapStartX = e.clientX;
        tapStartY = e.clientY;
        tapStartTimeMs = performance.now();
        isTapCandidate = true;
      } else if (pointers.size === 2) {
        dragging = false;
        velocityX = 0;
        velocityY = 0;
        pinchBaseDist = pinchDistance();
        pinchBaseZ = camera.position.z;
        isTapCandidate = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const dist = Math.max(1, pinchDistance());
        camera.position.z = clampZ(pinchBaseZ * (pinchBaseDist / dist));
      } else if (pointers.size === 1 && dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        velocityX = dx * 0.005;
        velocityY = dy * 0.005;
        if (isTapCandidate) {
          const totalDx = e.clientX - tapStartX;
          const totalDy = e.clientY - tapStartY;
          if (Math.hypot(totalDx, totalDy) > TAP_MAX_MOVE_PX) {
            isTapCandidate = false;
          }
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      renderer.domElement.releasePointerCapture(e.pointerId);
      if (pointers.size === 1) {
        // Promote remaining pointer to a drag anchor.
        const remaining = Array.from(pointers.values())[0];
        dragging = true;
        lastX = remaining.x;
        lastY = remaining.y;
        velocityX = 0;
        velocityY = 0;
        isTapCandidate = false;
      } else if (pointers.size === 0) {
        dragging = false;
        // If the gesture stayed within the tap envelope, raycast for an arc
        // hit. We do this BEFORE releaseView so the camera doesn't snap back
        // before the host has a chance to focus the tapped arc.
        const wasTap =
          isTapCandidate &&
          performance.now() - tapStartTimeMs <= TAP_MAX_DURATION_MS;
        isTapCandidate = false;
        if (wasTap) handleArcTap(e.clientX, e.clientY);

        const cameraOffDefault =
          Math.abs(camera.position.z - DEFAULT_CAM_Z) > 0.01;
        if (userInterruptedFocus || cameraOffDefault) {
          userInterruptedFocus = false;
          releaseView();
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = clampZ(camera.position.z + e.deltaY * 0.002);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // City labels: canvas-textured sprites attached to the globe so they
    // rotate with it. Opacity is faded in animate() based on world-space z so
    // labels on the back hemisphere disappear smoothly.
    const LABEL_HEIGHT = GLOBE_RADIUS * 0.05;
    const LABEL_WIDTH = LABEL_HEIGHT * 4; // matches the 4:1 canvas aspect
    type CityLabel = {
      sprite: THREE.Sprite;
      texture: THREE.Texture;
      material: THREE.SpriteMaterial;
    };
    const cityLabels: CityLabel[] = [];
    for (const city of CITY_LABELS) {
      const tex = makeCityLabelTexture(city.name);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        depthTest: false, // always render on top; opacity handles back-side hiding
      });
      const sprite = new THREE.Sprite(mat);
      const pos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS * 1.05);
      sprite.position.copy(pos);
      sprite.scale.set(LABEL_WIDTH, LABEL_HEIGHT, 1);
      mat.opacity = 0;
      globeGroup.add(sprite);
      cityLabels.push({ sprite, texture: tex, material: mat });
    }
    const labelTmp = new THREE.Vector3();

    // Arc system
    const glowTexture = makeGlowTexture();
    const SPRITE_SCALE = GLOBE_RADIUS * 0.05;

    // Number of trailing sprites behind the head while an arc is drawing.
    // Each is smaller and dimmer than the one in front of it, fading to nothing.
    const TRAIL_COUNT = 6;
    // How far behind the head (in arc-fraction) the last trail sprite sits.
    const TRAIL_LENGTH = 0.08;

    type ArcInstance = {
      group: THREE.Group;
      arcMesh: THREE.Mesh;
      uniforms: {
        uProgress: { value: number };
        uOpacity: { value: number };
        uColor: { value: THREE.Color };
      };
      startSprite: THREE.Sprite;
      endSprite: THREE.Sprite;
      headSprite: THREE.Sprite;
      trailSprites: THREE.Sprite[];
      curve: GreatCircleArcCurve;
      drawDur: number;
      holdDur: number;
      fadeDur: number;
      elapsed: number;
      metadata?: unknown;
    };
    const arcs: ArcInstance[] = [];

    const removeArc = (instance: ArcInstance) => {
      const idx = arcs.indexOf(instance);
      if (idx >= 0) arcs.splice(idx, 1);
      globeGroup.remove(instance.group);
      instance.arcMesh.geometry.dispose();
      (instance.arcMesh.material as THREE.Material).dispose();
      (instance.startSprite.material as THREE.Material).dispose();
      (instance.endSprite.material as THREE.Material).dispose();
      (instance.headSprite.material as THREE.Material).dispose();
      for (const s of instance.trailSprites) {
        (s.material as THREE.Material).dispose();
      }
    };

    const addArc = (opts: ArcOptions): (() => void) => {
      const {
        startLat,
        startLng,
        endLat,
        endLng,
        color = 0x4f46e5,
        altitude,
        drawDurationMs = 1500,
        holdDurationMs = 1500,
        fadeDurationMs = 800,
        metadata,
      } = opts;

      const start = latLngToVector3(startLat, startLng, GLOBE_RADIUS);
      const end = latLngToVector3(endLat, endLng, GLOBE_RADIUS);
      const angularDist = start.angleTo(end);
      const autoAlt = 0.15 + 0.5 * (angularDist / Math.PI);
      const alt = altitude ?? autoAlt;
      const curve = new GreatCircleArcCurve(start, end, GLOBE_RADIUS, alt);
      const tubeGeometry = new THREE.TubeGeometry(
        curve,
        64,
        GLOBE_RADIUS * 0.0035,
        8,
        false,
      );

      const colorObj = new THREE.Color(color);
      const uniforms = {
        uProgress: { value: 0 },
        uOpacity: { value: 1 },
        uColor: { value: colorObj },
      };
      const arcMaterial = new THREE.ShaderMaterial({
        vertexShader: ARC_VERTEX_SHADER,
        fragmentShader: ARC_FRAGMENT_SHADER,
        uniforms,
        transparent: true,
        depthWrite: false,
      });
      const arcMesh = new THREE.Mesh(tubeGeometry, arcMaterial);

      const makeSprite = () => {
        const mat = new THREE.SpriteMaterial({
          map: glowTexture,
          color: colorObj,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.setScalar(0);
        return sprite;
      };

      const startSprite = makeSprite();
      startSprite.position.copy(start).multiplyScalar(1.005);
      const endSprite = makeSprite();
      endSprite.position.copy(end).multiplyScalar(1.005);
      // Head sprite: travels along the curve while the arc is drawing.
      const headSprite = makeSprite();
      headSprite.position.copy(start).multiplyScalar(1.005);
      // Trail sprites: pooled, lag behind the head while drawing.
      const trailSprites: THREE.Sprite[] = [];
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const s = makeSprite();
        s.position.copy(start).multiplyScalar(1.005);
        trailSprites.push(s);
      }
      const group = new THREE.Group();
      group.add(arcMesh);
      group.add(startSprite);
      group.add(endSprite);
      group.add(headSprite);
      for (const s of trailSprites) group.add(s);
      globeGroup.add(group);

      const instance: ArcInstance = {
        group,
        arcMesh,
        uniforms,
        startSprite,
        endSprite,
        headSprite,
        trailSprites,
        curve,
        drawDur: drawDurationMs,
        holdDur: holdDurationMs,
        fadeDur: fadeDurationMs,
        elapsed: 0,
        metadata,
      };
      arcs.push(instance);

      return () => removeArc(instance);
    };

    const clearArcs = () => {
      while (arcs.length > 0) removeArc(arcs[arcs.length - 1]);
    };

    // Camera focus / auto-rotate state
    const DEFAULT_CAM_Z = 3;
    let autoRotate = true;
    type FocusState = {
      startYaw: number;
      targetYaw: number;
      startPitch: number;
      targetPitch: number;
      startCamZ: number;
      targetCamZ: number;
      startedMs: number;
      durationMs: number;
    };
    let focusState: FocusState | null = null;

    // Camera FOV is 45°, so the half-FOV is 22.5°. Use that to compute the
    // minimum camera distance that keeps both arc endpoints in frame.
    const HALF_FOV_RAD = (45 * Math.PI) / 180 / 2;
    const TAN_HALF_FOV = Math.tan(HALF_FOV_RAD);
    const FRAME_PADDING = 1.35; // 35% breathing room beyond the geometric minimum.

    const computeAutoZoom = (angularDist: number): number => {
      // After centering on the arc midpoint, each endpoint sits at half the
      // angular distance from the camera axis. The minimum camera Z that keeps
      // the endpoint within the half-FOV is:
      //   d_min = R * (cos(α) + sin(α) / tan(halfFOV))
      // where α = angularDist / 2 and R is the globe radius.
      const halfAngle = Math.min(Math.PI / 2, angularDist / 2);
      const minZ =
        GLOBE_RADIUS *
        (Math.cos(halfAngle) + Math.sin(halfAngle) / TAN_HALF_FOV);
      const padded = minZ * FRAME_PADDING;
      // Clamp into the user-zoom range so it never collides with manual zoom limits.
      return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, padded));
    };

    const focusOnArc = (
      a: { lat: number; lng: number },
      b: { lat: number; lng: number },
      opts: { zoom?: number; durationMs?: number } = {},
    ) => {
      const v1 = latLngToVector3(a.lat, a.lng, 1);
      const v2 = latLngToVector3(b.lat, b.lng, 1);
      const angularDist = v1.angleTo(v2);
      const mid = v1.clone().add(v2).normalize();
      // Convert the unit-vector midpoint back to lat/lng, then to a yaw/pitch
      // that brings that point in front of the camera. yaw spins longitude to
      // -π/2 (the camera direction in our coordinate system), pitch lifts
      // the latitude to the equator. Pitch is clamped so we never flip past
      // the pole, in case the midpoint is near a pole.
      const midLat = Math.asin(Math.max(-1, Math.min(1, mid.y)));
      const midLng = Math.atan2(-mid.z, mid.x);
      let targetYaw = -Math.PI / 2 - midLng;
      // Take the shortest path from current yaw (avoid spinning all the way
      // around the world when the natural target differs by 2π).
      while (targetYaw - yaw > Math.PI) targetYaw -= 2 * Math.PI;
      while (targetYaw - yaw < -Math.PI) targetYaw += 2 * Math.PI;
      const targetPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, midLat));

      focusState = {
        startYaw: yaw,
        targetYaw,
        startPitch: pitch,
        targetPitch,
        startCamZ: camera.position.z,
        targetCamZ: opts.zoom ?? computeAutoZoom(angularDist),
        startedMs: clock.elapsedTime * 1000,
        durationMs: opts.durationMs ?? 600,
      };
      // Kill drag velocity so it doesn't fight the focus tween.
      velocityX = 0;
      velocityY = 0;
    };

    const releaseView = (opts: { durationMs?: number } = {}) => {
      // Pull back to default zoom and tilt back to "north up" (pitch = 0).
      // Yaw is preserved so the globe doesn't snap horizontally. It just
      // returns to a flat-map-style orientation, then idle drift resumes.
      focusState = {
        startYaw: yaw,
        targetYaw: yaw,
        startPitch: pitch,
        targetPitch: 0,
        startCamZ: camera.position.z,
        targetCamZ: DEFAULT_CAM_Z,
        startedMs: clock.elapsedTime * 1000,
        durationMs: opts.durationMs ?? 800,
      };
      velocityX = IDLE_YAW_VEL;
      velocityY = 0;
    };

    const setAutoRotate = (enabled: boolean) => {
      autoRotate = enabled;
    };

    apiRef.current = { addArc, clearArcs, focusOnArc, releaseView, setAutoRotate };

    // Head sprite is brighter/larger than the endpoint sprites. It represents
    // the leading edge of the arc as it's being drawn.
    const HEAD_SCALE = SPRITE_SCALE * 1.6;
    const HEAD_FADE_MS = 180; // pop in / fade out time at the start/end of draw
    const headTmp = new THREE.Vector3();

    const tickArcs = (dtMs: number) => {
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.elapsed += dtMs;
        const { drawDur, holdDur, fadeDur } = arc;
        const startMat = arc.startSprite.material as THREE.SpriteMaterial;
        const endMat = arc.endSprite.material as THREE.SpriteMaterial;
        const headMat = arc.headSprite.material as THREE.SpriteMaterial;

        if (arc.elapsed < drawDur) {
          // Draw phase
          const progress = arc.elapsed / drawDur;
          arc.uniforms.uProgress.value = progress;
          arc.uniforms.uOpacity.value = 1;
          startMat.opacity = 1;
          endMat.opacity = 1;
          const startScale =
            Math.min(1, arc.elapsed / 220) * SPRITE_SCALE;
          arc.startSprite.scale.setScalar(startScale);
          const endStart = drawDur * 0.85;
          const endScale =
            arc.elapsed > endStart
              ? Math.min(1, (arc.elapsed - endStart) / 220) * SPRITE_SCALE
              : 0;
          arc.endSprite.scale.setScalar(endScale);

          // Head: sample the curve at the leading edge and ride along.
          arc.curve.getPoint(progress, headTmp);
          arc.headSprite.position.copy(headTmp).multiplyScalar(1.008);
          // Pop in over HEAD_FADE_MS, fade out over HEAD_FADE_MS at the end.
          const popIn = Math.min(1, arc.elapsed / HEAD_FADE_MS);
          const popOut = Math.min(
            1,
            Math.max(0, drawDur - arc.elapsed) / HEAD_FADE_MS,
          );
          const headIntensity = popIn * popOut;
          arc.headSprite.scale.setScalar(HEAD_SCALE * headIntensity);
          headMat.opacity = headIntensity;

          // Trail: each sprite sits a bit further back along the curve, smaller
          // and dimmer the further it lags. Hidden once it falls behind progress=0.
          for (let ti = 0; ti < arc.trailSprites.length; ti++) {
            const sprite = arc.trailSprites[ti];
            const trailMat = sprite.material as THREE.SpriteMaterial;
            // Even spacing across TRAIL_LENGTH; ti=0 is closest to the head.
            const offset = ((ti + 1) / arc.trailSprites.length) * TRAIL_LENGTH;
            const tProgress = progress - offset;
            if (tProgress <= 0 || popIn < 1) {
              sprite.scale.setScalar(0);
              trailMat.opacity = 0;
              continue;
            }
            arc.curve.getPoint(tProgress, headTmp);
            sprite.position.copy(headTmp).multiplyScalar(1.008);
            // Quadratic falloff so the tail fades fast and feels comet-like.
            const falloff = 1 - (ti + 1) / (arc.trailSprites.length + 1);
            const intensity = falloff * falloff * popOut;
            sprite.scale.setScalar(HEAD_SCALE * 0.85 * falloff);
            trailMat.opacity = intensity;
          }
        } else if (arc.elapsed < drawDur + holdDur) {
          // Hold phase
          arc.uniforms.uProgress.value = 1;
          arc.uniforms.uOpacity.value = 1;
          startMat.opacity = 1;
          endMat.opacity = 1;
          arc.startSprite.scale.setScalar(SPRITE_SCALE);
          arc.endSprite.scale.setScalar(SPRITE_SCALE);
          arc.headSprite.scale.setScalar(0);
          headMat.opacity = 0;
          for (const s of arc.trailSprites) {
            s.scale.setScalar(0);
            (s.material as THREE.SpriteMaterial).opacity = 0;
          }
        } else if (fadeDur === 0) {
          // Permanent
          arc.uniforms.uProgress.value = 1;
          arc.uniforms.uOpacity.value = 1;
        } else if (arc.elapsed < drawDur + holdDur + fadeDur) {
          // Fade phase
          const t = (arc.elapsed - drawDur - holdDur) / fadeDur;
          const opacity = 1 - t;
          arc.uniforms.uProgress.value = 1;
          arc.uniforms.uOpacity.value = opacity;
          startMat.opacity = opacity;
          endMat.opacity = opacity;
          const scale = SPRITE_SCALE * (1 - t * 0.3);
          arc.startSprite.scale.setScalar(scale);
          arc.endSprite.scale.setScalar(scale);
        } else {
          removeArc(arc);
        }
      }
    };

    const clock = new THREE.Clock();
    // Pre-allocated world-axis vectors used by the rotation logic so we don't
    // allocate Vector3s in the animate loop.
    const WORLD_Y = new THREE.Vector3(0, 1, 0);
    const WORLD_X = new THREE.Vector3(1, 0, 0);

    let frameId = 0;
    const animate = () => {
      const dtMs = clock.getDelta() * 1000;

      if (focusState) {
        // Focus tween: lerp yaw/pitch/cam-Z toward the focus target.
        const t = Math.min(
          1,
          (clock.elapsedTime * 1000 - focusState.startedMs) /
            focusState.durationMs,
        );
        const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
        yaw =
          focusState.startYaw +
          (focusState.targetYaw - focusState.startYaw) * e;
        pitch =
          focusState.startPitch +
          (focusState.targetPitch - focusState.startPitch) * e;
        camera.position.z =
          focusState.startCamZ +
          (focusState.targetCamZ - focusState.startCamZ) * e;
        if (t >= 1) focusState = null;
      } else if (autoRotate) {
        yaw += velocityX;
        pitch += velocityY;
        if (!dragging) {
          velocityX += (IDLE_YAW_VEL - velocityX) * 0.02;
          velocityY *= 0.95;
        }
      } else if (dragging) {
        yaw += velocityX;
        pitch += velocityY;
      }

      // Clamp pitch so the globe can't flip upside down.
      if (pitch > PITCH_LIMIT) pitch = PITCH_LIMIT;
      if (pitch < -PITCH_LIMIT) pitch = -PITCH_LIMIT;

      // Rebuild the orientation from yaw + pitch every frame: yaw first
      // around world Y, then pitch around world X. This keeps north up
      // (pole stays in the world Y direction post-yaw, then tilts forward
      // by pitch) regardless of any prior rotations.
      globeGroup.quaternion.identity();
      globeGroup.rotateOnWorldAxis(WORLD_Y, yaw);
      globeGroup.rotateOnWorldAxis(WORLD_X, pitch);

      tickArcs(dtMs);

      // Fade city labels by their facing direction. Camera looks down -Z, so
      // higher world-z = closer to camera = more visible. Smoothstep across
      // the horizon so labels at the edges fade gently rather than popping.
      for (const { sprite, material } of cityLabels) {
        sprite.getWorldPosition(labelTmp);
        const t = THREE.MathUtils.smoothstep(labelTmp.z, -0.05, 0.45);
        material.opacity = t * 0.9;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      clearArcs();
      glowTexture.dispose();
      for (const { texture, material } of cityLabels) {
        texture.dispose();
        material.dispose();
      }
      apiRef.current = null;
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      atmosphere.geometry.dispose();
      atmosphereMaterial.dispose();
      starsGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none" }}
    />
  );
});
