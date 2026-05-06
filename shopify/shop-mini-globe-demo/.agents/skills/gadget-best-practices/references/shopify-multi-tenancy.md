# Shopify Multi-Tenancy

**📖 Full docs:**
- [Shopify data security](https://docs.gadget.dev/guides/plugins/shopify/advanced-topics/data-security.md)
- [Access control](https://docs.gadget.dev/guides/access-control.md)

## The Golden Rule

**All models storing merchant data MUST have `belongsTo shop: ShopifyShop`.**

Non-negotiable for data security.

## Why It Matters

Shopify apps serve thousands of merchants. Each merchant's data must be completely isolated.

**Without tenancy:**
- ❌ Data leaks across merchants
- ❌ Security breaches
- ❌ App rejection

## The Tenancy Model

`shopifyShop` = tenant
- One record per installed shop
- Auto-created on install
- Contains domain, access token, etc.

## Adding Tenancy

### Step 1: Add Shop Relationship

```javascript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "4wsXHT7K37US",
  fields: {
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "FoALRe0qR2K5",
    },
  },
};
```

### Step 2: Add Permission Filters

Create a Gelly filter file `accessControl/filters/product/shop-tenant.gelly`:
```gelly
filter ($session: Session) on Product [
  where shopId == $session.shopId
]
```

Then configure permissions in `accessControl/permissions.gadget.ts`:
```typescript
import type { GadgetPermissions } from "gadget-server";

export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "shopify-app-users",
      default: {
        read: false,
        action: false,
      },
      models: {
        product: {
          read: { filter: "accessControl/filters/product/shop-tenant.gelly" },
          actions: {
            create: true,
            update: { filter: "accessControl/filters/product/shop-tenant.gelly" },
            delete: { filter: "accessControl/filters/product/shop-tenant.gelly" }
          }
        }
      }
    }
  }
};
```

## Scoping Queries in Actions

### Get Current Shop

```javascript
export const run = async ({ connections }) => {
  const shopId = connections.shopify.currentShopId;
  const shopDomain = connections.shopify.currentShopDomain;
};
```

### Scoped Queries

```javascript
export const run = async ({ api, connections }) => {
  const shopId = connections.shopify.currentShopId;

  // ✅ Correct
  const products = await api.product.findMany({
    filter: { shopId: { equals: shopId } }
  });

  // ❌ WRONG - returns ALL shops' products
  const products = await api.product.findMany();
};
```

## Nested Tenancy

Add direct `shop` relationship even when models are nested:

✅ **Correct - Denormalized:**
```typescript
// api/models/comment/schema.gadget.ts
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Jkl234MnoPqr",
  fields: {
    post: {
      type: "belongsTo",
      parent: { model: "post" },
      storageKey: "Stu567VwxYza",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "Bcd890EfgHij",  // Direct relationship
    },
  },
};
```

```gelly
// accessControl/filters/comment/shop-tenant.gelly
filter ($session: Session) on Comment [
  where shopId == $session.shopId
]
```

❌ **Avoid - Traversing:**
```typescript
// api/models/comment/schema.gadget.ts
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Klm123NopQrs",
  fields: {
    post: {
      type: "belongsTo",
      parent: { model: "post" },
      storageKey: "Tuv456WxyZab",
    },
    // No shop field - bad!
  },
};
```

```gelly
// accessControl/filters/comment/post-shop-tenant.gelly
// Slower - traverses relationship
filter ($session: Session) on Comment [
  where post.shopId == $session.shopId
]
```

## Background Jobs

Pass `shopId` to use adaptive rate limiter:

```javascript
export const onSuccess = async ({ api, connections, record }) => {
  await api.enqueue(api.processProduct, {
    productId: record.id,
    shopId: connections.shopify.currentShopId
  });
};
```

```javascript
// In background action
export const run = async ({ api, params, connections }) => {
  const shopId = params.shopId;
  const shopify = connections.shopify.forShopId(shopId);
  // Use shopify...
};
```

## Calling Shopify API

```javascript
export const onSuccess = async ({ connections }) => {
  const shopify = connections.shopify.current;

  const result = await shopify.graphql(`
    query {
      products(first: 10) {
        edges { node { id title } }
      }
    }
  `);
};
```

**In background jobs:**
```javascript
const shopify = connections.shopify.forShopId(params.shopId);
```

See [shopify-integration.md](shopify-integration.md).

## Frontend

Current shop is automatically scoped:

```javascript
import { useSession } from "@gadgetinc/react";

function MyComponent() {
  const session = useSession();
  const shop = session?.shop;

  // API calls auto-scoped to current shop
  const [{ data }] = useFindMany(api.product);
}
```

## Common Patterns

### Auto-assign Shop

```javascript
// api/models/customTag/actions/create.js
export const run = async ({ record, connections }) => {
  record.shop = { _link: connections.shopify.currentShopId };
  await record.save();
};
```

### Shop-Scoped Bulk Delete

```javascript
export const run = async ({ api, connections }) => {
  const shopId = connections.shopify.currentShopId;

  await api.product.bulkDelete({
    filter: { shopId: { equals: shopId } }
  });
};
```

## Best Practices

**DO:**
- ✅ Add `shop` to every model
- ✅ Add permission filters referencing Gelly files (e.g., `accessControl/filters/product/shop-tenant.gelly`)
- ✅ Always filter by `shopId` in queries
- ✅ Set `shop` when creating
- ✅ Use denormalized tenancy
- ✅ Test with multiple shops

**DON'T:**
- ❌ Skip `shop` relationship
- ❌ Query without `shopId` filter
- ❌ Traverse relationships in filters
- ❌ Forget to set `shop` on create

## Common Mistakes

1. **Missing `shop` relationship** - #1 cause of data leaks
2. **Not filtering by `shopId`** - Returns all shops' data
3. **Forgetting to set `shop`** - Records not scoped
4. **Using traversed filters** - Slower than direct

## See Also

- [access-control.md](access-control.md) - Permission system
- [shopify-integration.md](shopify-integration.md) - Shopify patterns
- [models.md](models.md) - Model design
