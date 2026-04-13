# Webhooks

**📖 Full docs:**
- [Shopify webhooks](https://docs.gadget.dev/guides/plugins/shopify/shopify-webhooks.md)
- [BigCommerce webhooks](https://docs.gadget.dev/guides/plugins/bigcommerce/webhooks.md)

## Overview

Webhooks let external services notify your Gadget app when events occur. Gadget provides specialized support for Shopify and BigCommerce webhooks, plus general webhook patterns.

Shopify and BigCommerce webhooks run using Gadget's background actions system.

## Shopify Webhooks

Gadget automatically registers webhooks with Shopify on relevant model actions.

Global actions can also use Shopify webhooks as triggers

### Setup

1. Open a model action in Gadget IDE
2. Add "Shopify webhook" trigger
3. Select topic (`orders/create`, `products/update`, etc.)

### Handler Pattern

```javascript
// api/models/shopifyOrder/actions/create.js
export const run = async ({ record, api, logger, connections }) => {
  // Webhook payload is in record
  logger.info({ orderId: record.id }, "Order webhook received");

  // Process order...
  record.processed = true;
  await record.save();
};

export const onSuccess = async ({ record, api }) => {
  // Enqueue side effects
  await api.enqueue(api.notifyCustomer, {
    orderId: record.id
  });
};
```

### Best Practices

- ✅ Keep webhook handlers fast (< 5 seconds)
- ✅ Enqueue long operations
- ✅ Make handlers idempotent (can run multiple times safely)
- ✅ Log important events
- ❌ Don't call Shopify API synchronously (enqueue instead)

See [shopify-integration.md](shopify-integration.md) for complete patterns.

## BigCommerce Webhooks

### Setup

1. Open a global action in Gadget IDE
2. Add "BigCommerce webhook" trigger
3. Select topic (`store/product/created`, etc.)

**Important:** BigCommerce webhooks only include resource ID, not full data.

### Handler Pattern

```typescript
// api/actions/handleProductCreate.ts
export const run = async ({ params, api, connections }) => {
  const bigcommerce = connections.bigcommerce.current;

  // Fetch full data using ID from webhook
  const product = await bigcommerce?.v3.get("/catalog/products/{product_id}", {
    path: { product_id: params.id }
  });

  // Store in Gadget
  await api.bigcommerce.product.upsert({
    bigcommerceId: product.id,
    name: product.name,
    store: { _link: connections.bigcommerce.currentStoreId },
    on: ["bigcommerceId", "store"]
  });
};
```

See [bigcommerce-integration.md](bigcommerce-integration.md) for complete patterns.

## General Webhooks (External Services)

For webhooks from other services (GitHub, Stripe, etc.), use HTTP routes.

### Route Handler

```javascript
// api/routes/POST-webhook-github.js
export default async function (request, reply) {
  // 1. Verify signature
  const signature = request.headers["x-hub-signature-256"];
  const body = JSON.stringify(request.body);

  if (!verifySignature(signature, body)) {
    return reply.code(401).send({ error: "Invalid signature" });
  }

  // 2. Extract event data
  const { action, repository } = request.body;

  // 3. Enqueue processing (don't block webhook)
  await api.enqueue(api.processGithubEvent, {
    action,
    repository
  });

  // 4. Return 200 immediately
  reply.code(200).send({ success: true });
}
```

## Webhook Best Practices

### 1. Return Quickly

Webhooks have timeouts (typically 5-30 seconds). Return 200 immediately:

```javascript
export const run = async ({ api, record }) => {
  // ✅ Enqueue long operations
  await api.enqueue(api.processOrder, { orderId: record.id });
};
```

```javascript
// ❌ Don't do long operations synchronously
export const run = async ({ record, connections }) => {
  // This might take 30+ seconds and timeout
  await connections.external.processOrder(record);
};
```

### 2. Make Handlers Idempotent

Webhooks can be delivered multiple times. Design handlers to handle duplicates:

```javascript
export const run = async ({ api, params }) => {
  // Check if already processed
  const existing = await api.order.findFirst({
    filter: { externalId: { equals: params.orderId } }
  });

  if (existing) {
    return; // Already processed, skip
  }

  // Process order...
};
```

### 3. Verify Signatures

Always verify webhook signatures to prevent spoofing:

```javascript
import crypto from "crypto";

function verifySignature(signature, body, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export default async function (request, reply) {
  const signature = request.headers["x-signature"];
  const body = JSON.stringify(request.body);

  if (!verifySignature(signature, body, process.env.WEBHOOK_SECRET)) {
    return reply.code(401).send({ error: "Invalid signature" });
  }

  // Process webhook...
}
```

### 4. Handle Failures Gracefully

```javascript
export const run = async ({ api, params, logger }) => {
  try {
    // Process webhook...
    logger.info({ orderId: params.orderId }, "Webhook processed");
  } catch (error) {
    logger.error({ error, orderId: params.orderId }, "Webhook failed");
    throw error; // Trigger retry (if enqueuedDon't return success if processing failed
  }
};
```

### 5. Log Everything

```javascript
export const run = async ({ logger, params }) => {
  logger.info({ event: params.event }, "Webhook received");

  // Process...

  logger.info({ event: params.event }, "Webhook processed successfully");
};
```

## Webhook Loops

### The Problem

Webhook triggers action → Action writes to external service → External service sends webhook → Loop!

### The Solution

Use change detection before writing back:

```javascript
// 1. Webhook handler - only read and store
export const run = async ({ record, connections }) => {
  // Just save the data from webhook
  record.status = params.status;
  await record.save();
};

// 2. Model action - check changes before writing
export const onSuccess = async ({ record, connections }) => {
  // Only write if status actually changed
  if (record.changed("status")) {
    const external = connections.external.current;
    await external.updateStatus(record.id, record.status);
  }
};
```

## Testing Webhooks

Many services provide webhook testing tools:
- Shopify: Use development store and trigger events
- BigCommerce: Use sandbox store
- Others: Use tools like ngrok + webhook.site

## Common Patterns

### Webhook to Background Job

```javascript
export const run = async ({ api, params }) => {
  // Acknowledge webhook immediately
  await api.enqueue(api.processWebhookData, params);
};
```

### Webhook with Validation

```javascript
export const run = async ({ params, logger }) => {
  if (!params.orderId || !params.status) {
    logger.error({ params }, "Invalid webhook payload");
    throw new Error("Missing required fields");
  }

  // Process...
};
```

### Webhook with Deduplication

```javascript
export const run = async ({ api, params }) => {
  // Use upsert to handle duplicates
  await api.order.upsert({
    externalId: params.orderId,
    status: params.status,
    on: ["externalId"]
  });
};
```

## Common Mistakes

1. **Not returning quickly** - Causes timeouts
2. **Not verifying signatures** - Security vulnerability
3. **Not handling duplicates** - Creates duplicate records
4. **Creating webhook loops** - App becomes unstable
5. **Not enqueueing long operations** - Timeouts

## Best Practices

**DO:**
- ✅ Return 200 immediately
- ✅ Enqueue long operations
- ✅ Verify signatures
- ✅ Make handlers idempotent
- ✅ Log all webhook events
- ✅ Use change detection to avoid loops
- ✅ Handle failures gracefully

**DON'T:**
- ❌ Run long operations synchronously
- ❌ Trust unverified webhooks
- ❌ Create duplicate records
- ❌ Write back to sender without checks
- ❌ Skip error handling

## Summary

Webhooks notify your app of external events. Return quickly, enqueue long operations, verify signatures, and make handlers idempotent. For Shopify and BigCommerce, use specialized webhook triggers. For other services, use HTTP routes with manual verification.

See also:
- [shopify-integration.md](shopify-integration.md) - Shopify webhook patterns
- [bigcommerce-integration.md](bigcommerce-integration.md) - BigCommerce webhook patterns
- [routes.md](routes.md) - HTTP routes for general webhooks
- [background-jobs.md](background-jobs.md) - Enqueueing patterns
