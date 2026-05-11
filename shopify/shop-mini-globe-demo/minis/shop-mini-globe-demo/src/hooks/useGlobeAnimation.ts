import { useRef, useState } from "react";
import type { GlobeHandle } from "../components/Globe";
import type { PathPoint, HistoryShipment, HistoryStats } from "../types";
import { pickArcColor, computeHistoryStats } from "../utils";

// Slow trace: each arc draws over ~4s.
const ARC_DRAW_DURATION_MS = 4000;
const ARC_STAGGER_GAP_MS = 250;
// Camera focuses on each arc before drawing it. Zoom is auto-computed inside
// the Globe component so both endpoints stay in frame.
const FOCUS_DURATION_MS = 700;
const RELEASE_DURATION_MS = 900;
const HISTORY_STAGGER_MS = 60;
const HISTORY_DRAW_DURATION_MS = 1200;

export function useGlobeAnimation() {
  const globeRef = useRef<GlobeHandle>(null);
  const pathTimeoutsRef = useRef<number[]>([]);
  // When the user interrupts a path, we suppress further camera moves but keep
  // drawing the arcs.
  const cameraSuppressedRef = useRef(false);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);

  const schedule = (fn: () => void, ms: number) => {
    pathTimeoutsRef.current.push(window.setTimeout(fn, ms));
  };

  const cancelPath = () => {
    pathTimeoutsRef.current.forEach(clearTimeout);
    pathTimeoutsRef.current = [];
  };

  const drawPath = (path: PathPoint[]) => {
    cancelPath();
    globeRef.current?.clearArcs();
    cameraSuppressedRef.current = false;
    setHistoryStats(null);

    if (path.length < 2) {
      globeRef.current?.setAutoRotate(true);
      return;
    }

    // Pause idle drift for the duration of the path animation.
    globeRef.current?.setAutoRotate(false);
    const segmentDuration = FOCUS_DURATION_MS + ARC_DRAW_DURATION_MS + ARC_STAGGER_GAP_MS;

    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      const segmentStart = i * segmentDuration;

      // 1. Rotate + zoom toward this arc's midpoint (skipped after interrupt).
      schedule(() => {
        if (cameraSuppressedRef.current) return;
        globeRef.current?.focusOnArc(
          { lat: start.lat, lng: start.lng },
          { lat: end.lat, lng: end.lng },
          { durationMs: FOCUS_DURATION_MS },
        );
      }, segmentStart);

      // 2. Draw the arc, which always runs, even after a user interrupt.
      schedule(() => {
        globeRef.current?.addArc({
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
          color: pickArcColor(),
          drawDurationMs: ARC_DRAW_DURATION_MS,
          fadeDurationMs: 0,
        });
      }, segmentStart + FOCUS_DURATION_MS);
    }

    // After the last arc finishes drawing: zoom back out, then resume drift.
    const totalDuration = (path.length - 1) * segmentDuration;
    schedule(() => {
      if (cameraSuppressedRef.current) return;
      globeRef.current?.releaseView({ durationMs: RELEASE_DURATION_MS });
    }, totalDuration);
    schedule(() => globeRef.current?.setAutoRotate(true), totalDuration + RELEASE_DURATION_MS);
  };

  const drawAllShipments = (shipments: HistoryShipment[]) => {
    cancelPath();
    globeRef.current?.clearArcs();
    cameraSuppressedRef.current = true;
    globeRef.current?.releaseView({ durationMs: RELEASE_DURATION_MS });
    globeRef.current?.setAutoRotate(true);
    setHistoryStats(computeHistoryStats(shipments));

    let arcIndex = 0;
    for (const shipment of shipments) {
      for (let i = 0; i < shipment.path.length - 1; i++) {
        const start = shipment.path[i];
        const end = shipment.path[i + 1];
        schedule(() => {
          globeRef.current?.addArc({
            startLat: start.lat,
            startLng: start.lng,
            endLat: end.lat,
            endLng: end.lng,
            color: pickArcColor(),
            drawDurationMs: HISTORY_DRAW_DURATION_MS,
            holdDurationMs: 5000,
            fadeDurationMs: 1000,
          });
        }, arcIndex * HISTORY_STAGGER_MS);
        arcIndex++;
      }
    }
  };

  const handleUserInteract = () => {
    cameraSuppressedRef.current = true;
    globeRef.current?.setAutoRotate(true);
  };

  return { globeRef, drawPath, drawAllShipments, historyStats, handleUserInteract };
}
