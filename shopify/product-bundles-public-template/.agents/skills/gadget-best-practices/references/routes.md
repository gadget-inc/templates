# HTTP Routes

**📖 Full docs:** [docs.gadget.dev/guides/http-routes](https://docs.gadget.dev/guides/http-routes.md)

Routes are custom HTTP handlers built on Fastify. They provide full control over HTTP requests/responses when actions don't fit.

## When to Use

✅ **Use routes for:**
- HTTP streaming
- Custom content types (images, PDFs, binary)
- Non-standard HTTP patterns (WebSockets, long-polling)
- External webhooks with custom verification
- Custom OAuth flows

❌ **Don't use routes for:**
- Standard CRUD - use actions
- Business logic - use actions (transactional)
- Operations needing permissions - actions enforce RBAC
- Anything that fits the action model

**Rule:** 95% of the time, use actions. Routes for the other 5%.

## Creating Routes

File in `api/routes/`:

```
GET-hello.js          # GET /hello
POST-webhook.js       # POST /webhook
GET-users-[id].js     # GET /users/:id (dynamic)
POST-api-v2-data.js   # POST /api/v2/data
```

**Format:** `<METHOD>-<path>.js`
**Dynamic params:** Use `[param]`

## Basic Route

```javascript
// api/routes/GET-hello.js
export default async function (request, reply) {
  reply.send({ message: "Hello, world!" });
}
```

**Access:** `https://your-app.gadget.app/hello`

## Request/Reply Objects

```javascript
export default async function (request, reply) {
  // Query params (?foo=bar)
  const { foo } = request.query;

  // Path params (/users/:id)
  const { id } = request.params;

  // Body (JSON)
  const { name, email } = request.body;

  // Headers
  const auth = request.headers.authorization;

  // JSON response
  reply.send({ data: "..." });

  // Custom status
  reply.code(201).send({ created: true });

  // Redirect
  reply.redirect("/new-url");
}
```

## Common Patterns

### Dynamic Path Params

```javascript
// api/routes/GET-users-[id].js
export default async function (request, reply) {
  const { id } = request.params;
  const user = await api.user.findOne(id);

  if (!user) {
    return reply.code(404).send({ error: "Not found" });
  }

  reply.send({ user });
}
```

### Custom Content Types

```javascript
// api/routes/GET-image.js
export default async function (request, reply) {
  const imageBuffer = Buffer.from("...");
  reply.type("image/png").send(imageBuffer);
}
```

## Authentication

Routes don't auto-enforce auth - check manually.

## External Webhooks

```javascript
// api/routes/POST-webhook-github.js
export default async function (request, reply) {
  // 1. Verify signature
  const signature = request.headers["x-hub-signature-256"];
  if (!verifySignature(signature, request.body)) {
    return reply.code(401).send({ error: "Invalid signature" });
  }

  // 2. Enqueue processing (don't block)
  await api.enqueue(api.processGithubEvent, request.body);

  // 3. Return immediately
  reply.code(200).send({ success: true });
}
```

## Error Handling

```javascript
export default async function (request, reply) {
  try {
    const result = await someOperation();
    reply.send(result);
  } catch (error) {
    request.log.error({ error }, "Operation failed");
    reply.code(500).send({ error: "Internal error" });
  }
}
```

## Logging

```javascript
export default async function (request, reply) {
  request.log.info({ userId: request.params.id }, "Fetching user");

  try {
    const user = await api.user.findOne(request.params.id);
    request.log.info({ user }, "User fetched");
    reply.send({ user });
  } catch (error) {
    request.log.error({ error }, "Failed");
    throw error;
  }
}
```

## Best Practices

**DO:**
- ✅ Use routes only when actions don't fit
- ✅ Validate inputs explicitly
- ✅ Handle errors gracefully
- ✅ Verify webhook signatures
- ✅ Enqueue long operations
- ✅ Return appropriate status codes

**DON'T:**
- ❌ Use routes for standard CRUD
- ❌ Forget to check authentication
- ❌ Run long operations synchronously
- ❌ Try to use internal API from frontend (it doesn't exist there)
- ❌ Trust unverified webhooks

## Common Mistakes

1. **Using routes when actions work** - Actions more powerful
2. **Forgetting authentication** - Routes don't auto-enforce
3. **Not verifying signatures** - Security vulnerability
4. **Blocking responses** - Enqueue instead
5. **Wrong status codes** - Use 201 for creates, 404 for not found

## See Also

- [actions.md](actions.md) - When to use actions instead
- [background-jobs.md](background-jobs.md) - Enqueueing patterns
- [shopify-integration.md](shopify-integration.md) - GDPR webhooks
- [webhooks.md](webhooks.md) - Webhook handling

**📖 More info:**
- [HTTP routes overview](https://docs.gadget.dev/guides/http-routes.md)
- [Route structure](https://docs.gadget.dev/guides/http-routes/route-structure.md)
- [Common use cases](https://docs.gadget.dev/guides/http-routes/common-use-cases.md)
