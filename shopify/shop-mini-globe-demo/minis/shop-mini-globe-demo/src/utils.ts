import type { PathPoint, HistoryShipment, HistoryStats } from "./types";

// Mono palette: hues clustered around indigo, violet, and cyan so arcs feel
// related rather than rainbow.
const ARC_COLORS = [
  0x4f46e5, 0x6366f1, 0x818cf8, // indigo
  0x7c3aed, 0x8b5cf6, 0xa78bfa, // violet
  0x0891b2, 0x22d3ee, 0x67e8f9, // cyan
];

export const pickArcColor = () => ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];

export const formatKm = (km: number): string =>
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

export const computeHistoryStats = (shipments: HistoryShipment[]): HistoryStats => {
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
