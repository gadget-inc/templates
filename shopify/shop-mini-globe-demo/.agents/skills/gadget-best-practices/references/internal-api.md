# Internal API and Atomic Updates

**📖 Full docs:**
- [API access to data](https://docs.gadget.dev/guides/data-access/api)
- [Actions and API](https://docs.gadget.dev/guides/actions/actions-and-api)
- [Optimizing your bill (Internal API guidance)](https://docs.gadget.dev/guides/account-and-billing/optimizing-your-bill)

Use Internal API as an explicit low-level tool. Prefer Public API unless you need raw writes.

## When to use Internal API

✅ Use when you need:
- High-volume imports/migrations where action logic is unnecessary
- Direct database writes without running action lifecycle
- Concurrency-safe numeric increments/decrements with `_atomics`
- Data fixes where business logic must be bypassed

❌ Do not use when you need:
- Action `run` / `onSuccess` behavior
- Permission filters/tenancy behavior from Public API calls
- Nested writes to related records
- Frontend access

## Core behavior and limits

- Internal API skips action lifecycle (`run`, `onSuccess`) and most validations.
- Internal API is backend-only (`api.internal` is unavailable in frontend code).
- Internal API does not support live queries (`live: true`).
- Internal API does not support nested writes for related records.
- Internal API requests require admin-capable context.

## Admin vs session context

Defaults vary by runtime context:
- Model/global actions and backend routes are admin by default.
- React Router/Remix handlers are session-scoped by default.

In session-scoped handlers, elevate explicitly when needed:

```ts
const records = await context.api.actAsAdmin.widget.findMany();
```

Use `actAsAdmin` intentionally and minimize elevated scope.

## Atomic updates (`_atomics`)

Use `_atomics` to avoid read-modify-write race conditions on numeric fields.

```ts
await api.internal.inventoryItem.update(itemId, {
  _atomics: {
    quantityOnHand: { decrement: 1 },
    reservationCount: { increment: 1 },
  },
});
```

Use atomic updates when all are true:
- Field is numeric
- Concurrent updates can happen
- You need database-level safe increments/decrements

Use Public API when you need business rules to execute.

## Practical patterns

### Bulk maintenance operations

Use internal bulk functions when action logic is intentionally skipped:

```ts
await api.internal.logEntry.deleteMany({
  filter: { createdAt: { lessThan: cutoffDate } },
});
```

## Safety checklist

1. Confirm skipping action lifecycle is intentional.
2. Confirm tenancy/access implications are handled explicitly.
3. Prefer smallest possible write surface.
4. Add logs and post-write verification for critical operations.
5. Add tests for high-risk internal writes (especially `_atomics` behavior).

## Common mistakes

- Using Internal API from frontend code.
- Using Internal API where action side effects are required.
- Forgetting admin/session context differences in loaders/actions.
- Implementing counters with normal `update` instead of `_atomics` under concurrency.
