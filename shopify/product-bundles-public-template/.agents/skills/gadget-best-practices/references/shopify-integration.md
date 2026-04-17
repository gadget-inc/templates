# Shopify Integration

**📖 Full docs:** [docs.gadget.dev/guides/plugins/shopify](https://docs.gadget.dev/guides/plugins/shopify.md)

## Setup

1. Add Shopify connection in Gadget web editor
2. Configure OAuth scopes (read_products, write_orders, etc.)
3. Shopify models auto-created (Product, Order, Customer, etc.)
4. Install flow automatic

**Result:** `shopifyShop` model tracks installed shops, webhooks registered, OAuth handled.

## The Golden Rule

**All models storing merchant data MUST have `belongsTo shop: ShopifyShop`.**

See [shopify-multi-tenancy.md](shopify-multi-tenancy.md) for complete tenancy patterns.

## Key Patterns

### TOML Is the Source of Truth (Framework 1.7.0+)

In framework `1.7.0+`, Shopify app configuration is TOML-driven. Treat the primary TOML file for the environment as the source of truth for Shopify app configuration:

- `shopify.app.toml` for production
- `shopify.app.{environment-name}.toml` for non-production environments

Scopes, app metadata, URLs, and app-managed webhook subscriptions are defined there. Do not treat `settings.gadget.ts` or legacy webhook status fields like `registeredWebhooks` as authoritative in `v1.7+` apps.

For global actions with Shopify webhook triggers, action code references TOML-managed subscriptions via `triggerKey`, while the subscription itself lives in `[[webhooks.subscriptions]]` in TOML.

See:
- [Shopify App TOML](https://docs.gadget.dev/guides/plugins/shopify/advanced-topics/shopify-app-toml.md)
- [Framework v1.7 migration](https://docs.gadget.dev/guides/gadget-framework/v1-7-migration.md)

### Webhook Triggers

Shopify model actions will automatically trigger on relevant Shopify webhooks

Global actions can trigger on Shopify webhooks:

1. Open model action in IDE
2. Add "Shopify webhook" trigger
3. Select topic (`orders/create`, `products/update`, etc.)

```javascript
// api/models/shopifyOrder/actions/create.js
export const run = async ({ params, record, connections }) => {
  applyParams(params, record);
  await preventCrossUserDataAccess(params, record);
  await save(record);
};
```

### Syncing

Syncs can be kicked off from the Gadget web editor or using the sync API:

```typescript
export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  await api.shopifySync.run({
    domain: record.domain,
    shop: {
      _link: record.id,
    },
  });
};
```

**One-directional:** Changes in Shopify → Gadget

### Non-Webhook Fields and Models (Framework 1.6.0+)

Some Shopify fields are not present in webhook payloads. For these fields, configure fetch behavior per field:

- `fetchData: "onWebhook"`: Fetch from Shopify GraphQL when webhook events arrive.
- `fetchData: "later"`: Defer to sync/reconciliation (default for new apps).

Use `fetchData: "onWebhook"` only where near-real-time data is necessary; it can increase Shopify API usage and webhook processing time, especially for `hasMany` fields that require pagination.

```typescript
// api/models/shopifyProduct/schema.gadget.ts
export const schema: GadgetModel = {
  fields: {
    seo: {
      fetchData: "onWebhook",
    },
  },
};
```

For action logic that depends on deferred fields, gate behavior by trigger type and field changes:

```typescript
export const onSuccess: ActionOnSuccess = async ({ trigger, record, logger }) => {
  const fromDeferredSync =
    trigger.type === "shopify_sync" || trigger.type === "shopify_webhook_reconciliation";

  if (fromDeferredSync && record.changed("someField")) {
    logger.info("someField updated by sync/reconciliation");
  }
};
```

Notes:
- Non-webhook fields are also populated during full sync and nightly reconciliation.
- Conditionally webhook-synced child models can update when parent `hasMany` fields are set to fetch on webhook.
- Fully non-webhook models update only during sync (including `scheduledShopifySync`).

### Shopify API Access

```javascript
export const run = async ({ connections }) => {
  const shopify = connections.shopify.current;

  // GraphQL query
  const result = await shopify.graphql(`
    query {
      products(first: 10) {
        edges { node { id title } }
      }
    }
  `);
};
```

### Resilient Writes

```javascript
export const onSuccess = async ({ api, connections, record }) => {
  const shopify = connections.shopify.current;

  // Enqueue Shopify mutation for resilience
  await api.enqueue(shopify.graphql, {
    query: `mutation ($input: ProductInput!) {
      productCreate(input: $input) {
        product { id }
      }
    }`,
    variables: { input: { title: record.title } }
  });
};
```

### Background Actions with Shopify Context

```javascript
// Pass shopId to background action
export const onSuccess = async ({ api, connections }) => {
  await api.enqueue(api.processShopifyData, {
    shopId: connections.shopify.currentShopId
  });
};

// Re-establish context in background action
export const run = async ({ params, connections }) => {
  const shopify = connections.shopify.forShopId(params.shopId);
  // Use shopify...
};
```

### Metafields

1. Create metafield definition in Shopify
2. Enable in Gadget connection
3. Access via nested field on model

### GDPR Webhooks (Required)

Gadget subscribes to Shopify GDPR webhook actions. Users need to implement the logic in the actions.

Required: `customer/redact`, `shop/redact`, `customer/data_request`

## Multi-Tenancy Checklist

For every model storing merchant data:

✅ Add `belongsTo shop: ShopifyShop`
✅ Add permission filter (Gelly file) that checks `shopId == $session.shopId`
✅ Filter queries by `shopId` in actions
✅ Set `shop` when creating records

See [shopify-multi-tenancy.md](shopify-multi-tenancy.md) for complete patterns.

## Common Mistakes

1. **Missing shop relationship** - Data leaks
2. **Not filtering by shopId** - Returns all shops' data
3. **Blocking webhook handlers** - Use `api.enqueue()`
4. **Ignoring rate limits** - Automatic, but enqueue bulk operations
5. **Missing GDPR webhooks** - Violates Shopify requirements

## Best Practices

- ✅ Always add shop relationship
- ✅ Enqueue external API calls
- ✅ Use `api.enqueue()` for bulk Shopify operations
- ✅ Handle GDPR webhooks
- ✅ Make webhooks idempotent
- ✅ Test with development store

## See Also

- [shopify-multi-tenancy.md](shopify-multi-tenancy.md) - Tenant isolation
- [webhooks.md](webhooks.md) - General webhook patterns
- [background-jobs.md](background-jobs.md) - Enqueueing patterns

**📖 More info:**
- [Shopify plugin overview](https://docs.gadget.dev/guides/plugins/shopify.md)
- [Building Shopify apps](https://docs.gadget.dev/guides/plugins/shopify/building-shopify-apps.md)
- [Shopify webhooks](https://docs.gadget.dev/guides/plugins/shopify/shopify-webhooks.md)
- [Syncing Shopify data](https://docs.gadget.dev/guides/plugins/shopify/syncing-shopify-data.md)
- [Non-webhook fields and models](https://docs.gadget.dev/guides/plugins/shopify/non-webhook-fields-and-models.md)
- [Shopify metafields](https://docs.gadget.dev/guides/plugins/shopify/advanced-topics/metafields-metaobjects.md)
- [Shopify OAuth](https://docs.gadget.dev/guides/plugins/shopify/advanced-topics/oauth.md)
