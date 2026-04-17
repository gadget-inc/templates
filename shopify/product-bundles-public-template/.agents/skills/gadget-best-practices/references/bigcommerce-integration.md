# BigCommerce Integration

**📖 Full docs:** [docs.gadget.dev/guides/plugins/bigcommerce](https://docs.gadget.dev/guides/plugins/bigcommerce.md)

## Setup

1. Create app in BigCommerce Developer Portal
2. Connect to Gadget - auto-creates app
3. Configure callback URLs
4. Select OAuth scopes
5. Install on sandbox store

**Result:** `bigcommerce/store` model tracks stores, OAuth handled, BigDesign installed.

## The Golden Rule

**All models storing merchant data MUST have `belongsTo store: BigCommerceStore`.**

```javascript
model product {
  field name: String
  field bigcommerceId: Number [required, unique(store)]
  belongsTo store: BigCommerceStore  // REQUIRED
}
```

## Key Patterns

### Multi-Tenancy Enforcement

**Permission filters:**
```gelly
filter($session: Session) on Product [
  where storeId == $session.bigcommerceStoreId
]
```

**Action code:**
```typescript
import { save, applyParams, preventCrossStoreDataAccess } from "gadget-server/bigcommerce";

export const run = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossStoreDataAccess(params, record);
  await save(record);
};
```

### Webhook Triggers

```typescript
export const run = async ({ params, api, connections }) => {
  const bigcommerce = connections.bigcommerce.current;

  // Webhook only includes ID - fetch full data
  const product = await bigcommerce?.v3.get("/catalog/products/{product_id}", {
    path: { product_id: params.id }
  });

  await api.bigcommerce.product.create({
    bigcommerceId: product.id,
    name: product.name,
    store: { _link: connections.bigcommerce.currentStoreId }
  });
};

export const options: ActionOptions = {
  triggers: {
    api: false,
    bigcommerce: {
      // action is triggered by the store/order/created webhook
      webhooks: ["store/order/created"],
    },
  },
};
```

### API Access

**Reading:**
```typescript
const bigcommerce = connections.bigcommerce.current;
const products = await bigcommerce?.v3.get("/catalog/products", {
  query: { limit: 5 }
});
```

**Writing:**
```typescript
await bigcommerce?.v3.post("/catalog/products", {
  body: { name: "New Product", type: "physical", price: 10 }
});
```

**Store context:**
```typescript
// With session
const bigcommerce = connections.bigcommerce.current;

// Without session (from background action)
const bigcommerce = await connections.bigcommerce.forStoreHash(storeHash);
```

### Avoiding Webhook Loops

Store data in Gadget, use change detection:

```typescript
// In webhook action - only read
export const run = async ({ params, api, connections }) => {
  const bigcommerce = connections.bigcommerce.current;
  const order = await bigcommerce.v2.get(`/orders/${params.id}`);

  await api.bigcommerce.order.upsert({
    bigcommerceId: order.id,
    status: order.status,
    on: ["bigcommerceId", "store"]
  });
};

// In model action - check changes before writing
export const onSuccess = async ({ record, connections }) => {
  if (record.changed("status") && record.status === "Shipped") {
    const bigcommerce = await connections.bigcommerce.forStoreHash(record.storeHash);
    await bigcommerce.v2.put("/orders/{order_id}", {
      path: { order_id: record.bigcommerceId },
      body: { status_id: 2 }
    });
  }
};
```

## Multi-Tenancy Checklist

For every model storing merchant data:

✅ Add `belongsTo store: BigCommerceStore`
✅ Add `bigcommerceId` field with uniqueness scoped to `store`
✅ Add permission filter (Gelly file) that checks `storeId == $session.bigcommerceStoreId`
✅ Use `preventCrossStoreDataAccess` in model actions
✅ Set `store` when creating records

## Common Mistakes

1. **Missing store relationship** - Data leaks
2. **Not using preventCrossStoreDataAccess** - Security vulnerability
3. **Webhook loops** - Use change detection
4. **Not using forStoreHash** - When calling actions without session
5. **Ignoring rate limits** - Use background action concurrency

## Best Practices

- ✅ Always add store relationship
- ✅ Store bigcommerceId on all models
- ✅ Use upsert for webhooks
- ✅ Enqueue bulk operations
- ✅ Use BigDesign components
- ✅ Add uniqueness validation scoped to store

## Frontend

BigDesign pre-installed:

```tsx
import { Panel, Button } from '@bigcommerce/big-design';

function App() {
  return (
    <Panel header="Products">
      <Button>Add Product</Button>
    </Panel>
  );
}
```

## See Also

- [webhooks.md](webhooks.md) - General webhook patterns
- [background-jobs.md](background-jobs.md) - Enqueueing and rate limiting
- [access-control.md](access-control.md) - Multi-tenancy permissions

**📖 More info:**
- [BigCommerce plugin overview](https://docs.gadget.dev/guides/plugins/bigcommerce.md)
- [BigCommerce webhooks](https://docs.gadget.dev/guides/plugins/bigcommerce/webhooks.md)
- [BigCommerce data](https://docs.gadget.dev/guides/plugins/bigcommerce/data.md)
- [BigCommerce frontends](https://docs.gadget.dev/guides/plugins/bigcommerce/frontends.md)
