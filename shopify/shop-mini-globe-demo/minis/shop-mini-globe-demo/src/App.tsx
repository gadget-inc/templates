import { useRef, useState } from "react";
import { SafeArea, useErrorToast } from "@shopify/shop-minis-react";
import { Globe, type GlobeHandle } from "./components/Globe";
import { useAuth } from "./hooks/useAuth";

// Mono palette: hues clustered around indigo, violet, and cyan so arcs feel
// related rather than rainbow.
const ARC_COLORS = [
  0x4f46e5, 0x6366f1, 0x818cf8, // indigo
  0x7c3aed, 0x8b5cf6, 0xa78bfa, // violet
  0x0891b2, 0x22d3ee, 0x67e8f9, // cyan
];
const pickArcColor = () => ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];

// Slow trace: each arc draws over ~4s.
const ARC_DRAW_DURATION_MS = 4000;
const ARC_STAGGER_GAP_MS = 250;
// Camera focuses on each arc before drawing it. Zoom is auto-computed inside
// the Globe component so both endpoints stay in frame.
const FOCUS_DURATION_MS = 700;
const RELEASE_DURATION_MS = 900;
const HISTORY_STAGGER_MS = 60;
const HISTORY_DRAW_DURATION_MS = 1200;

const TRACKING_API_BASE = "https://shop-mini-globe-demo--development.gadget.app";

type PathPoint = { location: string; lat: number; lng: number };
type HistoryShipment = { id: string; trackingNumber: string; path: PathPoint[] };
type HistoryStats = { packages: number; cities: number; km: number };

const formatKm = (km: number): string =>
  km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km} km`;

// Haversine on a unit sphere → km via Earth's mean radius (6371).
const haversineKm = (a: PathPoint, b: PathPoint): number => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
};

const computeHistoryStats = (shipments: HistoryShipment[]): HistoryStats => {
  const cities = new Set<string>();
  let km = 0;
  for (const s of shipments) {
    for (let i = 0; i < s.path.length; i++) {
      if (s.path[i].location) cities.add(s.path[i].location.toLowerCase());
      if (i > 0) km += haversineKm(s.path[i - 1], s.path[i]);
    }
  }
  return { packages: shipments.length, cities: cities.size, km: Math.round(km) };
};

// City pool used when the user types "TEST". A random subset becomes the demo path.
const TEST_CITIES = [
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
];

const buildTestPath = (): PathPoint[] => {
  const shuffled = [...TEST_CITIES].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, 5 + Math.floor(Math.random() * 3)) // 5-7 random stops
    .map((c) => ({ location: c.name, lat: c.lat, lng: c.lng }));
};

const buildTestHistory = (count: number): HistoryShipment[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `demo-${i}`,
    trackingNumber: `DEMO${String(i).padStart(4, "0")}`,
    path: buildTestPath(),
  }));

export function App() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);
  const { getValidToken } = useAuth();
  const { showErrorToast } = useErrorToast();
  const globeRef = useRef<GlobeHandle>(null);
  const pathTimeoutsRef = useRef<number[]>([]);
  // When the user interrupts a path, we suppress further camera moves but keep
  // drawing the arcs.
  const cameraSuppressedRef = useRef(false);

  const schedule = (fn: () => void, ms: number) => {
    pathTimeoutsRef.current.push(window.setTimeout(fn, ms));
  };

  const cancelPath = () => {
    pathTimeoutsRef.current.forEach(clearTimeout);
    pathTimeoutsRef.current = [];
  };

  const fetchAuth = async (path: string, init?: RequestInit) => {
    const token = await getValidToken();
    return fetch(`${TRACKING_API_BASE}${path}`, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    });
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

  const handleLoadHistory = async () => {
    if (isLoadingHistory) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetchAuth("/shop-mini/shipments");
      if (!response.ok) {
        showErrorToast({ message: "Couldn't load history. Please try again." });
        return;
      }
      const { shipments = [] } = await response.json();
      if (shipments.length === 0) {
        showErrorToast({ message: "No tracked packages yet. Search one to get started." });
        return;
      }
      drawAllShipments(shipments);
    } catch {
      showErrorToast({ message: "Couldn't load history. Please try again." });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSearch = async () => {
    const trimmed = trackingNumber.trim();
    if (!trimmed) return;

    // Demo bypass: type "TEST" to draw a hardcoded around-the-world path
    // without hitting Ship24 or the geocoder.
    if (trimmed.toUpperCase() === "TEST") {
      drawPath(buildTestPath());
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    // Kick the bar from 0 → 95% on the next tick so the CSS transition fires.
    // It eases over 12s, which roughly matches the worst-case geocoding wait.
    const fillTimer = window.setTimeout(() => setSearchProgress(95), 50);

    try {
      const response = await fetchAuth("/shop-mini/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });
      if (!response.ok) {
        showErrorToast({ message: "Couldn't track that. Please check the number and try again." });
        return;
      }

      const data = await response.json();
      drawPath(data?.path ?? []);
    } catch {
      showErrorToast({ message: "Couldn't track that. Please check the number and try again." });
    } finally {
      clearTimeout(fillTimer);
      setIsSearching(false);
      setSearchProgress(100);
      window.setTimeout(() => setSearchProgress(0), 600);
    }
  };

  return (
    <SafeArea className="flex flex-col h-screen bg-[#05060a] text-white">
      <div className="px-4 pt-6 pb-3 text-center">
        <h1 className="text-xl font-semibold">Package Tracker</h1>
        <p className="text-xs text-white/60 mt-1">Track your shipment around the globe</p>
      </div>

      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={isSearching}
            className="flex-1 px-4 py-3 bg-[#1a1b26] border border-[#2d2e3a] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#4f46e5] disabled:opacity-50"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !trackingNumber.trim()}
            className="px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        <div
          className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden"
          style={{ opacity: searchProgress > 0 ? 1 : 0, transition: "opacity 0.3s ease-out" }}
        >
          <div
            className="h-full bg-[#4f46e5] rounded-full"
            style={{
              width: `${searchProgress}%`,
              transition: isSearching
                ? "width 12s cubic-bezier(0.16, 1, 0.3, 1)"
                : "width 0.3s ease-out",
            }}
          />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleLoadHistory}
            disabled={isSearching || isLoadingHistory}
            className="flex-1 px-4 py-3 min-h-12 bg-transparent border border-[#2d2e3a] hover:border-[#4f46e5] rounded-lg text-sm text-white/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingHistory ? "Loading history..." : "View Full History"}
          </button>
          <button
            onClick={() => drawAllShipments(buildTestHistory(100))}
            disabled={isSearching || isLoadingHistory}
            className="flex-1 px-4 py-3 min-h-12 bg-transparent border border-[#2d2e3a] hover:border-[#4f46e5] rounded-lg text-sm text-white/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Demo (100)
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <Globe
          ref={globeRef}
          className="w-full h-full"
          onUserInteract={() => {
            cameraSuppressedRef.current = true;
            globeRef.current?.setAutoRotate(true);
          }}
        />

        {historyStats ? (
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
            <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white shadow-lg flex items-center justify-around text-center">
              <div>
                <div className="text-lg font-semibold">{historyStats.packages}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Packages</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-lg font-semibold">{historyStats.cities}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Cities</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-lg font-semibold">{formatKm(historyStats.km)}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Travelled</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SafeArea>
  );
}
