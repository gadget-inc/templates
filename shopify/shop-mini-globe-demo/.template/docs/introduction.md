# Shop Mini Globe Demo

Core Purpose: This template shows how to wire a Shopify Shop Mini to a Gadget backend with authenticated routes, third-party API integrations, and per-buyer data persistence. The Shop Mini lets a buyer enter a tracking number and watch their package's journey animate as arcs on an interactive 3D globe.

Key Functionality: A `useAuth` hook on the mini exchanges a short-lived Shop Mini token for a Gadget-signed JWT via `POST /shop-mini/auth`, which verifies the token against Shopify's Admin API and upserts a `miniBuyer` record. Subsequent requests to `POST /shop-mini/tracking` look up the tracking number on Ship24, geocode each event into latitude/longitude using geocode.maps.co, and persist the resolved path on a `shipment` record scoped to the buyer. `GET /shop-mini/shipments` returns the buyer's recent shipments so the globe can render their full history. A custom `shop-mini-buyers` role and Gelly access filters enforce that buyers only ever see their own data.

Relevant docs and APIs:

- [Shop Minis platform docs](https://shopify.dev/docs/api/shop-minis): Shop Mini SDK, authentication, and trusted domains.
- [Shopify Shop Minis admin API](https://github.com/Shopify/shop-minis/blob/main/supabase/README.md): Used by `POST /shop-mini/auth` to verify Shop Mini tokens via the `shopUser` query.
- [Ship24 tracking API](https://docs.ship24.com/): Used by `POST /shop-mini/tracking` to fetch carrier-agnostic shipment events for a tracking number.
- [geocode.maps.co](https://geocode.maps.co/): Used by `POST /shop-mini/tracking` to resolve event location strings (e.g. "Toronto, ON") into lat/lng coordinates.
- [Gadget JWT-signed sessions](https://docs.gadget.dev/guides/plugins/authentication): The auth route signs JWTs with `GADGET_ENVIRONMENT_JWT_SIGNING_KEY` so Gadget auto-populates `session` on subsequent API requests.
- [Gadget access control with Gelly](https://docs.gadget.dev/guides/access-control): The `shop-mini-buyers` role uses Gelly filters to scope reads to the current session's `miniBuyer`.
