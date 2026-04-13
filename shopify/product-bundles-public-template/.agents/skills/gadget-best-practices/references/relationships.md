# Relationships

**📖 Full docs:** [docs.gadget.dev/guides/models/relationships](https://docs.gadget.dev/guides/models/relationships.md)

Relationships connect models together, like foreign keys in SQL.

## Four Types

- **belongsTo** - Many-to-one (child → parent)
- **hasOne** - One-to-one
- **hasMany** - One-to-many (parent → children)
- **hasManyThrough** - Many-to-many via join model

## Golden Rule: Always Bidirectional

**CRITICAL:** Always create the inverse relationship on both models.

## belongsTo - Many to One or One to One

Example: `schema.gadget.ts` on a `comment` model, where `comment` belongsTo `post`:

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "KhFwR8h2ZlnZ",
  fields: {
    post: {
      type: "belongsTo",
      parent: { model: "post" },
      storageKey: "hUEQuQuSISJc",
    },
  },
};
```

## hasOne - One to One

Example: `schema.gadget.ts` on a `user` model, where `user` hasOne `profile`:

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "M4tc9dEo5QAi",
  fields: {
    profile: {
      type: "hasOne",
      child: { model: "profile", belongsToField: "user" },
      storageKey: "uo3Gt-dgM42k",
    },
  },
};
```

**Naming:** Use singular (`profile`, `author`).


## hasMany - One to Many

Example: `schema.gadget.ts` on a `post` model, where `post` hasMany `comments`:

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "M4tc9dEo5QAi",
  fields: {
    comments: {
      type: "hasMany",
      children: { model: "comment", belongsToField: "post" },
      storageKey: "fkoxdxH4F-iL",
    },
  },
};
```

**Naming:** Use plural (`comments`, `orders`, `products`)

## hasManyThrough - Many to Many

Example: `schema.gadget.ts` on a `student` model, where `student` hasMany `courses` through `registration`:

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "M4tc9dEo5QAi",
  fields: {
    courses: {
      type: "hasManyThrough",
      sibling: { model: "course", relatedField: "students" },
      join: {
        model: "registration",
        belongsToSelfField: "student",
        belongsToSiblingField: "course",
      },
      storageKey: "jaxjjNW_tx5X",
    },
  },
};
```

**Naming:** Use plural (`courses`, `orders`, `tags`)

**Important:** Don't create extra `hasMany` fields to join model - Gadget handles it automatically.

## Linking Records

### Creating

```javascript
// Link to existing
await api.post.create({
  title: "My Post",
  author: { _link: "user-123" }
});

// Many-to-many
await api.post.create({
  title: "My Post",
  tags: [{ _link: "tag-1" }, { _link: "tag-2" }]
});
```

### Updating

```javascript
await api.post.update("post-id", {
  author: { _link: "user-456" }
});
```

## Querying

```javascript
// Across relationships
const comments = await api.comment.findMany({
  filter: {
    post: {
      author: {
        email: { equals: "user@example.com" }
      }
    }
  }
});

// Select nested fields
const posts = await api.post.findMany({
  select: {
    id: true,
    title: true,
    author: { name: true, email: true },
    tags: { name: true }
  }
});
```

## Multi-Tenancy

For Shopify or BigCommerce apps, add direct `shop` or `bigcommerce/store` relationship:

✅ **Correct:**
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

✅ **Correct:**
```javascript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "4wsXHT7K37US",
  fields: {
    store: {
      type: "belongsTo",
      parent: { model: "bigcommerce/store" },
      storageKey: "FoALRe0qR2K5",
    },
  },
};
```

See [shopify-multi-tenancy.md](shopify-multi-tenancy.md).

## Best Practices

**DO:**
- ✅ Always create bidirectional relationships
- ✅ Use singular for belongsTo/hasOne
- ✅ Use plural for hasMany/hasManyThrough
- ✅ Specify cardinality
- ✅ Use `{ _link: "id" }` to connect records

**DON'T:**
- ❌ Create one-sided relationships
- ❌ Add "Id" suffix to belongsTo names
- ❌ Create hasMany to join model when using hasManyThrough
- ❌ Use JSON when relationships work better
- ❌ Forget expectedCreateCardinality

## See Also

- [models.md](models.md) - Model design patterns
- [shopify-multi-tenancy.md](shopify-multi-tenancy.md) - Denormalized tenancy
