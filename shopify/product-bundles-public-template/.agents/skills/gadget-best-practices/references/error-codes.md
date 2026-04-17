# Gadget Error Codes: Quick Triage

**📖 Full docs:**
- Open your app's API reference **Errors** page in docs UI: `/api/:slug/:environmentSlug/errors`
- [Logger](https://docs.gadget.dev/guides/development-tools/logger)
- [Rate limits](https://docs.gadget.dev/guides/development-tools/rate-limits)

Use this guide to diagnose failures quickly and choose the right fix path.

## Triage workflow

1. Capture the error code and message.
2. Correlate with logs (`ggt logs`) and request context (action/route/model).
3. Classify: auth/permissions, input/schema, transaction/timeouts, rate limits, or platform.
4. Apply targeted fix.
5. Add/adjust a regression test if issue came from app code.

## High-impact codes

### Auth and permissions

- `GGT_INVALID_API_KEY`
Cause: wrong/deleted/misapplied API key.
Fix: rotate key, verify auth mode, verify header/client config.

- `GGT_PERMISSION_DENIED`
Cause: actor lacks role/filter access.
Fix: verify role grants, permission filters, and caller context (`api` vs `api.actAsSession` vs `api.actAsAdmin`).

- `GGT_NO_CURRENT_SESSION`
Cause: session-only request made without session auth.
Fix: use browser-session auth when needed, or avoid current-session-only operations with API-key clients.

### Input and schema

- `GGT_INVALID_QUERY_INPUT`
Cause: invalid filter/sort/pagination/input shape.
Fix: validate generated client call shape and avoid invalid values (for example empty arrays for unsupported operators).

- `GGT_INVALID_ACTION_INPUT`
Cause: action identifier or nested action input is wrong.
Fix: use generated client methods; confirm action exists and namespacing is correct.

- `GGT_INVALID_STORED_DATA`
Cause: existing records no longer satisfy new schema constraints.
Fix: backfill/migrate records or relax validation temporarily; use internal API carefully for repair operations.

- `GGT_MISCONFIGURED_VALIDATION` / `GGT_MISCONFIGURED_FIELD`
Cause: model validation or field configuration is incomplete/invalid.
Fix: correct model config in editor and re-run checks.

### Transactions and timeouts

- `GGT_INCORRECT_TRANSACTION_SEQUENCE`
Cause: manual transaction calls out of order or wrong transport.
Fix: use `api.connection.transaction(...)` for external clients; avoid parallel transactions on one connection.

- `GGT_TRANSACTION_TIMEOUT`
Cause: transactional work exceeded timeout.
Fix: keep transactional `run` short; move external/slow work to `onSuccess` or background actions.

- `GGT_ACTION_TIMEOUT`
Cause: action exceeded execution limits.
Fix: split work, enqueue background tasks, reduce per-run workload, update `run` timeout.

- `GGT_DATABASE_OPERATION_TIMEOUT`
Cause: expensive query/mutation.
Fix: reduce selected relationships/page sizes, batch work, restructure hotspots.

### Data existence and required resources

- `GGT_RECORD_NOT_FOUND`
Cause: stale/nonexistent ID.
Fix: check existence before mutating; use maybe/find patterns where absence is expected.

- `GGT_MISSING_REQUIRED_ACTION` / `GGT_MISSING_REQUIRED_FIELD` / `GGT_MISSING_REQUIRED_DATA`
Cause: required model/action/field/data missing for platform operation.
Fix: restore required defaults/fields/actions or repair records.

### Operational/platform

- `GGT_TOO_MANY_REQUESTS`
Cause: request-rate limits exceeded.
Fix: batch operations, smooth traffic, shift bulk work to queued background actions.

- `GGT_INTERNAL_ERROR`
Cause: platform-side unexpected failure.
Fix: retry with correlation info and escalate to Gadget support if persistent.

- `GGT_UNKNOWN`
Cause: unhandled error in app code.
Fix: inspect stack/log context, add guards, and add regression test.

## Prevention checklist

- Run `ggt problems` before deploy.
- Keep transactional code short and deterministic.
- Prefer batch operations over per-record loops.
- Use explicit auth/role context in server code.
- Include structured logs with stable identifiers (`recordId`, `shopId`, `traceId`).
