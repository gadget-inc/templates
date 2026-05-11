import { useState } from "react";
import { SafeArea, useErrorToast } from "@shopify/shop-minis-react";
import { Globe } from "./components/Globe";
import { useAuth } from "./hooks/useAuth";
import { useGlobeAnimation } from "./hooks/useGlobeAnimation";
import { buildTestPath, buildTestHistory } from "./testData";
import { formatKm } from "./utils";

const TRACKING_API_BASE = "https://shop-mini-globe-demo--development.gadget.app";

export function App() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { getValidToken } = useAuth();
  const { showErrorToast } = useErrorToast();
  const { globeRef, drawPath, drawAllShipments, historyStats, handleUserInteract } =
    useGlobeAnimation();

  const fetchAuth = async (path: string, init?: RequestInit) => {
    const token = await getValidToken();
    return fetch(`${TRACKING_API_BASE}${path}`, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    });
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
        <Globe ref={globeRef} className="w-full h-full" onUserInteract={handleUserInteract} />

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
