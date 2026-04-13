# Background Jobs

**📖 Full docs:** [docs.gadget.dev/guides/actions/background-actions](https://docs.gadget.dev/guides/actions/background-actions.md)

## What Are Background Jobs?

Background jobs run actions asynchronously outside the main request/response cycle. They're powered by Temporal, a durable workflow orchestration system.

**Key features:**
- Non-blocking execution
- Automatic retries on failure
- Durable state (survives restarts)
- Scheduled execution
- Parallel execution

## When to Use Background Jobs

### DO Enqueue For:

✅ **Long-running operations** - Operations that take > 5 seconds
✅ **External API calls** - Calls that can fail or be slow
✅ **Email sending** - Non-urgent notifications
✅ **Bulk processing** - Processing many records
✅ **Scheduled tasks** - Recurring jobs (daily, weekly, etc.)
✅ **Operations that can fail** - Automatic retries built-in

### DON'T Enqueue For:

❌ **Fast operations** - Simple database writes (< 1 second)
❌ **Synchronous responses needed** - When user must wait for result
❌ **Real-time operations** - Immediate feedback required

## Basic Usage

### Enqueueing Actions

```javascript
// In any action
export const onSuccess = async ({ api, record }) => {
  // Enqueue a global action
  await api.enqueue(api.sendEmail, {
    to: record.email,
    subject: "Welcome!"
  });

  // Enqueue a model action
  await api.enqueue(api.post.publish, {
    id: record.id
  });
};
```

**Returns immediately** - The action runs in the background.

## Common Patterns

### Durable External API Calls

```javascript
// api/models/product/actions/syncToShopify.js
export const run = async ({ record, connections, logger }) => {
  const shopify = connections.shopify.forShopId(record.shopId);

  try {
    const result = await shopify.graphql(`
      mutation ($input: ProductInput!) {
        productCreate(input: $input) {
          product { id }
          userErrors { field message }
        }
      }
    `, {
      input: {
        title: record.title,
        descriptionHtml: record.description
      }
    });

    if (result.productCreate.userErrors.length > 0) {
      throw new Error(result.productCreate.userErrors[0].message);
    }

    // Save Shopify ID
    record.shopifyId = result.productCreate.product.id;
    await record.save();

    logger.info({ shopifyId: record.shopifyId }, "Product synced");
  } catch (error) {
    logger.error({ error }, "Failed to sync to Shopify");
    throw error;  // Will retry automatically
  }
};
```

**Enqueue from action:**
```javascript
export const onSuccess = async ({ api, record }) => {
  await api.enqueue(api.product.syncToShopify, {
    id: record.id
  });
};
```

### Shopify API Calls (Resilient)

For simple Shopify writes without result manipulation:

```javascript
export const onSuccess = async ({ api, connections, record }) => {
  const shopify = connections.shopify.current;

  // Enqueue the Shopify GraphQL mutation directly
  await api.enqueue(shopify.graphql, {
    query: `
      mutation ($input: ProductInput!) {
        productCreate(input: $input) {
          product { id title }
          userErrors { field message }
        }
      }
    `,
    variables: {
      input: {
        title: record.title
      }
    }
  });
};
```

See [shopify-integration.md](shopify-integration.md) for more patterns.

## Scheduled Tasks

Global actions can be scheduled to be enqueued at a future time.

```javascript
export const run: ActionRun = async ({ record }) => {
  await api.enqueue(
    api.change,
    {},
    // Scheduled to start at noon on April 3, 2024, UTC
    { startAt: "2024-04-03T12:00:00.000Z" }
  );
};
```

## Retry Behavior

Background jobs automatically retry on failure:

- **Retries:** Up to 6 times by default, 2 times in dev env
- **Backoff:** Exponential backoff between retries
- **Duration:** Retries for up to 7 days

```javascript
export const run = async ({ api }) => {
  await api.enqueue(
    api.someModelOrGlobalAction,
    { foo: "foo", bar: 10 },
    {
      retries: {
        retryCount: 5, // Retry up to 5 times
        maxInterval: 60000, // Max delay between retries: 60s
        backoffFactor: 2, // Doubles delay for each retry
        initialInterval: 1000, // Start with a 1s delay
        randomizeInterval: true, // Randomizes retry delay
      },
      // OR simply retries: 5
    }
  );
};
```

## Concurrency control

Background jobs can be run in dedicated queues with a max concurrency

```javascript
await api.enqueue(
    api.someModelOrGlobalAction,
    { foo: "foo", bar: 10 },
  // setting a queue with custom max concurrency
  { queue: { name: "dedicated-queue", maxConcurrency: 4 } }
);
```

## Queue Priority

Background actions can be given a priority ("low", "medium", "high") with higher priority actions being dispatched first

```javascript
// enqueue an action that should run before other default or low priority actions
await api.enqueue(api.publish, { postId: 1 }, { priority: "high" });
```

## Monitoring Jobs

### Job Status

Check job status in Gadget IDE:
- **Logs tab** - View all logs
- **Queues tab** - Monitor running jobs
- **Operations dashboard** - See enqueued jobs

## Best Practices

**DO:**
- ✅ Enqueue long-running operations (> 5 seconds)
- ✅ Enqueue external API calls that can fail
- ✅ Use structured logging with context
- ✅ Let jobs retry automatically (throw errors)
- ✅ Use scheduled tasks for recurring jobs
- ✅ Process in batches for bulk operations
- ✅ Include necessary context in params

**DON'T:**
- ❌ Enqueue trivial operations (< 1 second)
- ❌ Block user responses waiting for background jobs
- ❌ Forget to log errors
- ❌ Pass entire records as params (pass IDs instead)
- ❌ Run synchronous operations that should be async
- ❌ Call one action/API per record for large datasets — route calls, public API calls, and internal API calls all consume request rate limits; fan out in batches via background actions with concurrency controls instead

## Common Mistakes

1. **Not enqueueing external API calls** - Causes timeouts
2. **Passing large objects as params** - Pass IDs, fetch in background job
3. **Not logging errors** - Makes debugging impossible
4. **Forgetting to throw errors** - Disables automatic retries
5. **Enqueueing trivial operations** - Adds unnecessary latency

## Summary

Background jobs let you run long operations, call external APIs, and process bulk data without blocking user responses. Enqueue liberally for resilience and use scheduled tasks for recurring work. Let Temporal handle retries and durability.

See also:
- [actions.md](actions.md) - Creating actions to enqueue
- [shopify-integration.md](shopify-integration.md) - Shopify-specific patterns
- [webhooks.md](webhooks.md) - Processing webhooks asynchronously

**📖 More info:**
- [Background actions](https://docs.gadget.dev/guides/actions/background-actions.md)
- [Action triggers](https://docs.gadget.dev/guides/actions/triggers.md)
