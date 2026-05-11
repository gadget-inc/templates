import type { PathPoint, HistoryShipment } from "./types";

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

export const buildTestPath = (): PathPoint[] => {
  const shuffled = [...TEST_CITIES].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, 5 + Math.floor(Math.random() * 3))
    .map((c) => ({ location: c.name, lat: c.lat, lng: c.lng }));
};

export const buildTestHistory = (count: number): HistoryShipment[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `demo-${i}`,
    trackingNumber: `DEMO${String(i).padStart(4, "0")}`,
    path: buildTestPath(),
  }));
