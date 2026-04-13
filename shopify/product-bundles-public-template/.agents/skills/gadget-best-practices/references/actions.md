# Actions

**📖 Full docs:** [docs.gadget.dev/guides/actions](https://docs.gadget.dev/guides/actions.md)

Actions are server-side functions that run business logic and write data. They auto-generate GraphQL mutations, enforce permissions, and are transactional by default.

## Two Types

**Model-scoped** - Operate on a specific record
- Built-in: `create`, `update`, `delete`
- Custom: `publish`, `approve`, `archive`

**Global** - No record context, operate across models
- Cross-model, cross-record operations
- Scheduled tasks

## When to Use

✅ **Use actions for:**
- Writing data
- Business logic with side effects
- Operations requiring permissions
- Scheduled tasks

❌ **Don't use actions for:**
- Simple transformations (use computed fields)
- Streaming/custom HTTP (use routes)

## Decision Tree

```
Operates on specific model record?
├─ Yes → Model-scoped action
│  ├─ Standard CRUD? → Use built-in create/update/delete
│  └─ Custom operation? → Create named action
└─ No → Global action
```

## Model-Scoped Actions

### Custom Actions

```javascript
// api/models/post/actions/publish.js
export const run = async ({ api, record, logger }) => {
  record.publishedAt = new Date();
  record.status = "published";
  await record.save();
  logger.info({ postId: record.id }, "Published");
};

export const onSuccess = async ({ api, record }) => {
  await api.enqueue(api.notification.send, {
    postId: record.id
  });
};
```

**Call:** `await api.post.publish("post-id")`

### Action Functions

**`run`** - Main logic (transactional)
- Modify record
- Validate inputs
- Save to database
- Keep transactional work short (avoid long external calls)

**`onSuccess`** - Side effects (after commit)
- Send emails
- Call external APIs
- Enqueue background jobs

**Sample context params:**
- `api` - Regular API for queries (use `api.internal` only when direct database updates are needed - bypasses permissions, validations, and action lifecycle)
- `record` - The record being operated on
- `params` - Input parameters
- `logger` - Structured logger
- `connections` - External APIs (Shopify, etc.)
- `trigger` - Action trigger payload and info

### Input Parameters

**IMPORTANT:** Always define custom parameters using `export const params = { ... }`. Never use `as any` type casting to bypass TypeScript errors.

```javascript
export const params = {
  notifySubscribers: { type: "boolean", default: true },
  targets: { type: "json" },
  count: { type: "number", default: 5 },
};

export const run = async ({ params, record }) => {
  record.publishedAt = new Date();
  await record.save();

  const { notifySubscribers, targets, count } = params;
  if (notifySubscribers) {
    // Notify...
  }
};
```

### Transaction Boundaries

- Model actions are transactional by default.
- Global actions are non-transactional by default.
- Keep `run` focused on DB work that should commit/rollback together.
- Move long-running or external side effects to `onSuccess`.

## Global Actions

```javascript
// api/actions/generateReport.js
export const run = async ({ api, params, logger }) => {
  const users = await api.user.findMany({
    filter: { active: { equals: true } }
  });

  return {
    totalUsers: users.length,
    generatedAt: new Date()
  };
};
```

**Call:** `await api.generateReport()`

## Background Jobs

Enqueue actions to run asynchronously:

```javascript
export const onSuccess = async ({ api, record }) => {
  await api.enqueue(api.processImage, {
    imageId: record.id
  });
};
```

See [background-jobs.md](background-jobs.md) for patterns.

## Scheduled Tasks

Global actions can run on cron schedules:

```javascript
// api/actions/dailyDigest.js
export const run = async ({ api, logger }) => {
  const posts = await api.post.findMany({
    filter: { createdAt: { greaterThan: yesterday } }
  });
  logger.info({ count: posts.length }, "Digest sent");
};

export const options: ActionOptions = {
  triggers: {
    scheduler: [{ cron: "0 0 * * *" }],
  },
};
```

**Configure in IDE:** Add "Scheduler" trigger, set cron (e.g., `0 9 * * *`)

## Bulk Operations

Every action gets a bulk variant automatically:

```javascript
await api.post.bulkCreate([
  { title: "Post 1" },
  { title: "Post 2" }
]);

await api.post.bulkUpdate([
  { id: "1", title: "Updated 1" },
  { id: "2", title: "Updated 2" }
]);

await api.post.bulkDelete(["id-1", "id-2"]);
```

## Common Patterns

### Validation

```javascript
export const run = async ({ params, record }) => {
  if (params.price < 0) {
    throw new Error("Price must be positive");
  }
  record.price = params.price;
  await record.save();
};
```

### External APIs

```javascript
export const run = async ({ params, connections, logger }) => {
  try {
    const response = await fetch("https://api.example.com/data", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.API_KEY}` },
      body: JSON.stringify(params)
    });
    return await response.json();
  } catch (error) {
    logger.error({ error }, "API call failed");
    throw error;
  }
};
```

### Shopify API

```javascript
export const onSuccess = async ({ api, record, connections }) => {
  const shopify = connections.shopify.current;

  await api.enqueue(shopify.graphql, {
    query: `mutation { productCreate(input: { title: "${record.title}" }) { product { id } } }`
  });
};
```

See [shopify-integration.md](shopify-integration.md) for more patterns.

### Multi-Tenancy

Always filter by tenant:

```javascript
export const run = async ({ api, connections }) => {
  const shopId = connections.shopify.currentShopId;

  // ✅ Correct - scoped to shop
  const products = await api.product.findMany({
    filter: { shopId: { equals: shopId } }
  });

  // ❌ Wrong - returns ALL shops' data
  const products = await api.product.findMany();
};
```

See [shopify-multi-tenancy.md](shopify-multi-tenancy.md) for patterns.

## Permissions

Actions automatically enforce permissions configured in `accessControl/permissions.gadget.ts`.

See [access-control.md](access-control.md) for details.

## Logging

```javascript
export const run = async ({ logger, params }) => {
  logger.info({ userId: params.userId }, "Processing request");

  try {
    // ...operation...
    logger.info({ result }, "Success");
  } catch (error) {
    logger.error({ error, userId: params.userId }, "Failed");
    throw error;
  }
};
```

**Best practices:**
- Use structured fields (objects)
- Include context (IDs)
- Don't log sensitive data

## Best Practices

**DO:**
- ✅ Use actions for writes and side effects
- ✅ Keep `run` transactional
- ✅ Use `onSuccess` for side effects
- ✅ Enqueue long operations
- ✅ Filter by tenant in multi-tenant apps
- ✅ Use `api.internal` only when direct database updates are needed (bypasses permissions, validations, and action lifecycle - only available in backend code)
- ✅ Use `_atomics` for concurrency-safe numeric counters/quantities

**DON'T:**
- ❌ Call external APIs in `run` (use `onSuccess`)
- ❌ Forget to filter by tenant
- ❌ Run long operations synchronously

## Common Mistakes

1. **Using actions for reads unless absolutely necessary** - Use GraphQL queries or computed views, if possible
2. **Not enqueueing long operations** - Causes timeouts
3. **Not filtering by tenant** - Security vulnerability
4. **Forgetting `await record.save()`** - Changes won't persist

## See Also

- [routes.md](routes.md) - When to use routes instead
- [background-jobs.md](background-jobs.md) - Enqueueing patterns
- [access-control.md](access-control.md) - Permissions
- [shopify-integration.md](shopify-integration.md) - Shopify patterns

**📖 More info:**
- [Action types](https://docs.gadget.dev/guides/actions/types-of-actions.md)
- [Writing actions](https://docs.gadget.dev/guides/actions/writing-actions.md)
- [Background actions](https://docs.gadget.dev/guides/actions/background-actions)
- [Action triggers](https://docs.gadget.dev/guides/actions/triggers.md)
