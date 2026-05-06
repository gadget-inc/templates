import { RouteHandler } from "gadget-server";
import jwt from "jsonwebtoken";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const geocode = async (
  location: string,
): Promise<{ lat: number; lng: number } | null> => {
  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}&api_key=${process.env.GEOCODING_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  const top = results[0];
  if (!top) return null;
  const lat = parseFloat(top.lat);
  const lng = parseFloat(top.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

const route: RouteHandler = async ({ request, reply, api }) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Authorization header required" });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(
      authHeader.slice(7),
      process.env.GADGET_ENVIRONMENT_JWT_SIGNING_KEY!,
    );
  } catch {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }

  const { trackingNumber } = (request.body as any) ?? {};
  if (!trackingNumber || typeof trackingNumber !== "string") {
    return reply.code(400).send({ error: "Tracking number is required" });
  }

  const ship24Response = await fetch(
    "https://api.ship24.com/public/v1/trackers/track",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHIP24_API_KEY}`,
      },
      body: JSON.stringify({ trackingNumber }),
    },
  );

  if (!ship24Response.ok) {
    return reply
      .code(ship24Response.status === 404 ? 404 : 502)
      .send({ error: "Ship24 request failed" });
  }

  const ship24Body = await ship24Response.json();
  const events: any[] = (ship24Body?.data?.trackings?.[0]?.events ?? []).filter(
    (ev: any) => typeof ev?.location === "string" && ev.location.trim(),
  );

  if (events.length === 0) {
    return reply.code(404).send({ error: "No tracking results found for this number" });
  }

  // Ship24 events come back in arbitrary order; sort chronologically so the
  // arcs draw origin → destination.
  events.sort(
    (a, b) =>
      (Date.parse(a.occurrenceDatetime) || 0) -
      (Date.parse(b.occurrenceDatetime) || 0),
  );

  // Free-tier geocode.maps.co is ~1 req/sec, so we space calls out sequentially.
  const uniqueLocations = Array.from(
    new Set(events.map((ev) => ev.location.trim() as string)),
  );
  const geocodeMap = new Map<string, { lat: number; lng: number }>();
  for (let i = 0; i < uniqueLocations.length; i++) {
    const result = await geocode(uniqueLocations[i]);
    if (result) geocodeMap.set(uniqueLocations[i], result);
    if (i < uniqueLocations.length - 1) await sleep(1100);
  }

  const path: Array<{ location: string; lat: number; lng: number }> = [];
  let prevLocation: string | null = null;
  for (const ev of events) {
    const loc = ev.location.trim();
    if (loc === prevLocation) continue;
    const geo = geocodeMap.get(loc);
    if (!geo) continue;
    path.push({ location: loc, lat: geo.lat, lng: geo.lng });
    prevLocation = loc;
  }

  if (path.length > 0 && decoded?.publicId) {
    const buyer = await api.internal.miniBuyer.maybeFindFirst({
      filter: { publicId: { equals: decoded.publicId } },
      select: { id: true },
    });

    if (buyer) {
      const fields = { trackingNumber, path, lastFetchedAt: new Date() };
      const existing = await api.internal.shipment.maybeFindFirst({
        filter: {
          miniBuyerId: { equals: buyer.id },
          trackingNumber: { equals: trackingNumber },
        },
        select: { id: true },
      });
      if (existing) {
        await api.internal.shipment.update(existing.id, fields);
      } else {
        await api.internal.shipment.create({ ...fields, miniBuyer: { _link: buyer.id } });
      }
    }
  }

  return reply.send({ path });
};

route.options = {
  cors: { origin: true },
};

export default route;
