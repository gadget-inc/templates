# Data Access: Computed Views and Aggregates

**📖 Full docs:**
- [Computed fields](https://docs.gadget.dev/guides/data-access/computed-fields.md)
- [Computed views](https://docs.gadget.dev/guides/data-access/computed-views.md)
- [Gelly](https://docs.gadget.dev/guides/data-access/gelly.md)

Gadget provides two mechanisms for read-only computations beyond standard CRUD: **computed fields** (per-record) and **computed views** (cross-record queries). Both are written in **Gelly**, Gadget's expression language.

## When to use what

| Feature | Computed Fields | Computed Views |
|---|---|---|
| **Scope** | Single record + its relationships | Across multiple models |
| **Result** | A single value per record | A result set (rows) |
| **Definition** | `.gelly` file in `api/models/<model>/` | `.gelly` file in `api/views/` or inline `api.view()` |
| **Access** | Like any other field on the model | Separate API call (`api.viewName()`) |
| **Use case** | Counts, sums, averages on related records | Dashboards, reports, leaderboards, time-series |

## Computed Fields

Computed fields are read-only fields that transform or aggregate data. Values are dynamically calculated and cached when unchanged.

### Syntax

```gelly
// api/models/<model>/<fieldName>.gelly
field on <model> {
  <expression>
}
```

### Common patterns

**Per-record arithmetic:**
```gelly
// api/models/business/profit.gelly
field on business {
  revenue - costs
}
```

**Aggregate across relationships:**
```gelly
// api/models/customer/totalSpend.gelly
field on customer {
  sum(orders.totalPrice)
}

// api/models/post/commentCount.gelly
field on post {
  count(comments)
}

// api/models/store/averageOrderSize.gelly
field on store {
  avg(orders.totalPrice)
}
```

**Conditional aggregation:**
```gelly
// api/models/shopifyShop/publishedProductCount.gelly
field on shopifyShop {
  count(products, where: !isNull(products.publishedAt))
}

// api/models/user/recentTokens.gelly
field on user {
  sum(chatMessages.tokenCount, where: chatMessages.createdAt > now() - interval("30 days"))
}
```

### Reading computed fields

Computed fields are **included by default** in public API responses and **excluded by default** from internal API and action `record` objects.

```typescript
// Public API — included by default
const customer = await api.customer.findOne("123");
console.log(customer.totalSpend); // works

// Explicitly exclude to skip computation
const record = await api.someModel.findOne(123, { select: { computedField: false } });

// Internal API — must explicitly select
const record = await api.internal.someModel.findOne(123, { select: { computedField: true } });

// Inside an action — must fetch separately
const withComputed = await api.someModel.findOne(record.id, { select: { computedField: true } });
```

## Computed Views

Computed views are read-only queries for aggregations and transformations across multiple models. Requires Gadget framework 1.4+ and `@gadgetinc/react` 0.21.0+.

### Defining views

**Named views** — `.gelly` files in `api/views/`:
```gelly
// api/views/customerCount.gelly
view customerCount {
  count(customers)
}
```

**Inline views** — ad-hoc with `api.view()`:
```typescript
const result = await api.view(`{ count(customers) }`);
```

Named views get full type checking in the API client; inline views are better for one-off queries. **Named views are preferred.**

### Aggregate functions

```gelly
view postScore {
  maxScore: max((upvotes - downvotes) * 100)
  avgScore: avg((upvotes - downvotes) * 100)
  [ where createdAt > now() - interval("1 month") ]
}
```

### Group by (time-series, bucketing)

```gelly
// api/views/revenueReport.gelly
view {
  shopifyOrders {
    day: dateTrunc(part: "day", date: createdAt)
    revenue: sum(totalPrice)
    [
      where createdAt > now() - interval("30 days")
      group by day
    ]
  }
}
```

### Sorting and limiting

```gelly
// api/views/customerTotalSpend.gelly
view customerTotalSpend {
  customers {
    name
    sum(orders.totalPrice)
    [order by sum(orders.totalPrice) desc limit 10]
  }
}
```

### Query variables

Variables make views reusable with dynamic parameters. All variables are optional (default `null`).

```gelly
// api/views/revenueReport.gelly
view ($startDate: Date, $endDate: Date) {
  sum(orders.totalPrice, where: orders.createdAt > $startDate && orders.createdAt < $endDate)
}
```

```typescript
const report = await api.revenueReport({ startDate: new Date("2024-01-01"), endDate: new Date("2024-01-31") });
```

Always pass dynamic values as variables — never use string interpolation in inline views.

### Pagination

Views do not paginate by default. Use `limit`/`offset` variables to avoid the 10,000 result cap (`GGT_GELLY_RESULT_TRUNCATED` error):

```gelly
view ($limit: Int, $offset: Int) {
  customers {
    id
    name
    [order by totalSpend desc limit $limit offset $offset]
  }
}
```

The 10,000 limit applies to the final result set, not intermediate records processed within the query. Aggregations over millions of records are fine.

### Namespaces and scoping

| Location | API path | Scope |
|---|---|---|
| `api/views/foo.gelly` | `api.foo()` | All models |
| `api/views/reports/foo.gelly` | `api.reports.foo()` | Models in `reports` namespace |
| `api/models/customer/views/summary.gelly` | `api.customer.summary()` | Fields on `customer` directly |

Model-namespaced views can reference fields without prefixing the model name:

```gelly
// api/models/customer/views/summary.gelly
view {
  name
  orderCount: count(orders)
  minOrderAmount: min(orders.totalPrice)
}
```

### Querying from frontend

```tsx
import { useView } from "@gadgetinc/react";

// Named view
const [{ data, fetching, error }] = useView(api.finishedReport);

// With variables
const [{ data }] = useView(api.customerCount, { status: "active" });

// Inline view
const [{ data }] = useView(`{ count(customers) }`);
```

### Access control

Views respect the caller's permissions by default — model filters apply before computation. To query across all records (e.g. leaderboards), use `api.actAsAdmin` in server-side code only:

```typescript
// In a route loader — server-side only
const leaderboard = await context.api.actAsAdmin.leaderboard();
```

`actAsAdmin` cannot be used with the `useView` hook (client-side). Wrap in an action or loader instead.

**Key difference from computed fields:** Computed fields always see all data (single cached value per record). Computed views filter data per caller by default.

## Performance notes

- Both computed fields and views execute SQL at read time.
- Gadget manages indexes automatically.
- Views support up to ~50M records; beyond that, use a dedicated analytics DB.
- Views are rate-limited: 60s of query time per 10s wall time per environment.
- Views run on a read replica (P95 lag <200ms). Do not use in transactions requiring latest writes.
- Exclude unneeded computed fields with `select: { field: false }` to skip computation.
