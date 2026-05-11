import * as THREE from "three";

// Major cities and shipping hubs labelled on the globe. Order doesn't matter;
// opacity is driven by per-frame facing checks so back-side labels disappear
// automatically.
export const CITY_LABELS: Array<{ name: string; lat: number; lng: number }> = [
  // Major cities
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  // Major shipping & cargo hubs
  { name: "Memphis", lat: 35.1495, lng: -90.049 }, // FedEx SuperHub
  { name: "Louisville", lat: 38.2527, lng: -85.7585 }, // UPS Worldport
  { name: "Anchorage", lat: 61.2181, lng: -149.9003 }, // global cargo transit
  { name: "Mississauga", lat: 43.589, lng: -79.6441 }, // Pearson / Canada hub
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Atlanta", lat: 33.749, lng: -84.388 },
  { name: "Cincinnati", lat: 39.1031, lng: -84.512 }, // Amazon Air, DHL
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821 }, // DHL Europe
  { name: "Leipzig", lat: 51.3397, lng: 12.3731 }, // DHL Europe hub
  { name: "Liège", lat: 50.6326, lng: 5.5797 }, // Alibaba EU hub
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 }, // Schiphol cargo
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Shenzhen", lat: 22.5431, lng: 114.0579 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 }, // Incheon cargo
];

export function makeCityLabelTexture(text: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.font =
    '600 28px ui-sans-serif, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // Dark stroke for legibility against bright arcs and the dark globe.
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
