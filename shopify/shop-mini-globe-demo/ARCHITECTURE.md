# More info

Supplementary technical notes for developers extending this template. The [README](./README.md) covers setup, workflow, and the model/route inventory. This document covers the implementation details that aren't obvious from reading the code.

## Resources

- [Shopify's Shop Mini docs](https://shopify.dev/docs/api/shop-minis)
- [Shopify's Supabase Edge Functions example](https://github.com/Shopify/shop-minis/blob/main/supabase/README.md): the auth code in `useAuth.ts` is adapted from this example's [authentication hook](https://github.com/Shopify/shop-minis/blob/main/supabase/README.md#complete-authentication-hook).
- [Ship24 tracking API](https://docs.ship24.com/)
- [geocode.maps.co API](https://geocode.maps.co/)

## How JWT signing with Gadget works

The `POST /shop-mini/auth` route signs JWTs with `GADGET_ENVIRONMENT_JWT_SIGNING_KEY`. The two claims that matter:

- `aud` set to your Gadget app's primary domain
- `sub` set to the session ID

When this JWT is presented as a Bearer token to Gadget's GraphQL/REST API, Gadget recognizes the signature and auto-populates `session` from `sub`. You don't need to verify the token in actions or routes that use the standard Gadget API client. Access control filters (Gelly) then run with the session populated, scoping reads to the current `miniBuyer`.

The custom routes (`POST /shop-mini/tracking`, `GET /shop-mini/shipments`) still verify the JWT manually because they need to read custom claims like `publicId` directly from the payload.

## Making authenticated requests from the mini

`useAuth` exposes `getValidToken()`, which returns a fresh JWT (refreshing it if expired). The pattern used throughout `App.tsx`:

```typescript
const { getValidToken } = useAuth();

const fetchAuth = async (path: string, init?: RequestInit) => {
  const token = await getValidToken();
  return fetch(`${TRACKING_API_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
  });
};
```

The hook stores the JWT in Shop Mini secure storage so it survives across sessions on the device.

## `manifest.json` configuration

The mini's `manifest.json` declares the scopes it requires and the domains it is allowed to call:

```json
{
  "scopes": ["openid"],
  "trusted_domains": [
    "<your-app-name>--development.gadget.app",
    "cdn.jsdelivr.net"
  ]
}
```

`cdn.jsdelivr.net` must remain in `trusted_domains` because the globe component loads its texture assets from there. Add any additional domains here if you extend the mini to call other backends.

## Tracking flow internals

When `POST /shop-mini/tracking` runs, it does five things in sequence:

1. Calls Ship24 to fetch the event list for the tracking number.
2. Sorts events chronologically and de-duplicates consecutive same-location events so the globe doesn't draw zero-length arcs.
3. Geocodes each unique location via geocode.maps.co. The free tier is rate-limited to ~1 request per second, so the route paces calls sequentially with an 1100ms delay between them. If you upgrade to a paid plan, you can parallelize this.
4. Upserts the resolved path (`[{ location, lat, lng }, ...]`) onto the buyer's `shipment` record.
5. Returns the path to the mini, which animates one arc per leg.

`GET /shop-mini/shipments` returns the most-recent 100 shipments for the buyer. The mini draws every leg simultaneously with a brief stagger, then fades them out, so the user sees a heatmap-style overview of their full history.

## Adding new buyer-scoped models

When you add a model that should be scoped to a buyer, give it a `belongsTo` relationship to `miniBuyer` and link it inside the `create` action using the session:

```typescript
export const run: ActionRun = async ({ params, record, logger, session }) => {
  applyParams(params, record);

  // make sure the miniBuyer id is on the session
  if (session?.get("miniBuyer")) {
    // link the current record to the miniBuyer id
    (record as any).miniBuyer = {
      _link: session.get("miniBuyer"),
    };
  } else {
    logger.error({ session }, "No user id for session");
    throw new Error("No user id for session");
  }

  await save(record);
};
```

For `update`, `delete`, and `custom` actions on the same model, manually verify that the related `miniBuyer` id matches `session.get("miniBuyer")` before mutating. Gelly filters protect reads, but writes must be guarded explicitly.
