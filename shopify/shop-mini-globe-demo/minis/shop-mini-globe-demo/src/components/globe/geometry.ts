import * as THREE from "three";

export function latLngToVector3(lat: number, lng: number, radius: number) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const r = Math.cos(latRad);
  return new THREE.Vector3(
    r * Math.cos(lngRad),
    Math.sin(latRad),
    -r * Math.sin(lngRad),
  ).multiplyScalar(radius);
}

/**
 * Curve that follows the great-circle path between two surface points and
 * bulges outward by a sine-shaped altitude bump (peak at the midpoint).
 * Every sampled point has radius >= the globe radius, so the arc never
 * dips below the surface, unlike a quadratic Bezier through an elevated
 * midpoint, which sags into the globe for arcs longer than ~90°.
 */
export class GreatCircleArcCurve extends THREE.Curve<THREE.Vector3> {
  private readonly startUnit: THREE.Vector3;
  private readonly endUnit: THREE.Vector3;
  private readonly angle: number;
  private readonly sinAngle: number;

  constructor(
    start: THREE.Vector3,
    end: THREE.Vector3,
    private readonly radius: number,
    private readonly peakAltitude: number,
  ) {
    super();
    this.startUnit = start.clone().normalize();
    this.endUnit = end.clone().normalize();
    this.angle = this.startUnit.angleTo(this.endUnit);
    this.sinAngle = Math.sin(this.angle);
  }

  override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    let dir: THREE.Vector3;
    if (this.sinAngle < 1e-6) {
      // Near-degenerate (co-located or exactly antipodal). Lerp on the
      // sphere; the altitude bump still lifts the curve clear of the surface.
      dir = this.startUnit.clone().lerp(this.endUnit, t);
      const len = dir.length();
      if (len > 1e-6) dir.divideScalar(len);
      else dir.copy(this.startUnit);
    } else {
      const a = Math.sin((1 - t) * this.angle) / this.sinAngle;
      const b = Math.sin(t * this.angle) / this.sinAngle;
      dir = this.startUnit
        .clone()
        .multiplyScalar(a)
        .add(this.endUnit.clone().multiplyScalar(b));
    }
    const heightFactor = Math.sin(t * Math.PI); // 0 at endpoints, 1 at midpoint
    const r = this.radius * (1 + this.peakAltitude * heightFactor);
    return optionalTarget.copy(dir).multiplyScalar(r);
  }
}
