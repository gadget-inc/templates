export type PathPoint = { location: string; lat: number; lng: number };
export type HistoryShipment = { id: string; trackingNumber: string; path: PathPoint[] };
export type HistoryStats = { packages: number; cities: number; km: number };
