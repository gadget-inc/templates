# Fields

**📖 Full docs:** [docs.gadget.dev/guides/models/fields](https://docs.gadget.dev/guides/models/fields.md)

## What Are Fields?

Fields define the columns in your database tables (models). Each field has:
- **Type** - What kind of data it stores
- **Identifier** - The API name for the field
- **Validations** - Rules for valid data
- **Options** - Type-specific configuration

## Field Types

### Text Fields

**String**
- Short text (up to 10,000 characters by default)
- Use for names, titles, emails, URLs

**RichText**
- Long-form formatted content
- Stores HTML or Markdown
- Use for blog posts, descriptions, notes

### Numeric Fields

**Number**
- Integers or decimals
- Use for counts, prices, quantities

### Boolean Fields

**Boolean**
- True/false values
- Use for flags and toggles

### Date/Time Fields

**DateTime**
- Timestamp with date and time
- Use for creation times, deadlines, events

**Date**
- Date only (no time component)
- Use for birthdays, due dates

### Enum Fields

**Enum**
- Predefined set of options
- Use for states, categories, types (2-5 options)

**When to use:**
- ✅ Fixed set of known options
- ✅ Named states or categories

**When NOT to use:**
- ❌ Many options - use a related model instead
- ❌ Options that change frequently - use a related model

### JSON Fields

**JSON**
- Arbitrary structured data
- Use sparingly - prefer relationships when schema is known

**⚠️ Warning:** Only use JSON when:
- Schema is unknown ahead of time
- Data is truly unstructured
- External API response you don't control

**Prefer related models** when you know the schema.

### File Fields

**File**
- Upload and store files
- Use for images, documents, attachments

Gadget handles storage automatically.

### Relationship Fields

**belongsTo**, **hasOne**, **hasMany**, **hasManyThrough**
- Connect models together
- See [relationships.md](relationships.md) for detailed patterns

### Encrypted Fields

**EncryptedString**
- Encrypted at rest
- Use for sensitive data (API keys, tokens)

**Never use for:**
- ❌ Passwords (use Gadget's built-in auth instead)
- ❌ Data you need to query or filter by (encryption prevents queries)

### Computed Fields

**Computed**
- Calculated values (not stored)
- Defined with Gelly expressions
- Included by default in public API, excluded from internal API and action `record` objects

See [data-access.md](data-access.md) for syntax, aggregate patterns, and usage details.

## Field Naming

### Use camelCase

```
✅ firstName
✅ publishedAt
✅ orderNumber

❌ first_name
❌ published_at
❌ OrderNumber
```

### Relationship Field Names

**Singular for belongsTo and hasOne:**

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Def345GhiJkl",
  fields: {
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "Mno678PqrStu",
    },
    author: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "Vwx901YzaBcd",
    },
    profile: {
      type: "hasOne",
      child: { model: "profile", belongsToField: "user" },
      storageKey: "Efg234HijKlm",
    },
  },
};
```

**Plural for hasMany and hasManyThrough:**

```typescript
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Nop567QrsTuv",
  fields: {
    comments: {
      type: "hasMany",
      children: { model: "comment", belongsToField: "post" },
      storageKey: "Wxy890ZabCde",
    },
    orders: {
      type: "hasMany",
      children: { model: "order", belongsToField: "customer" },
      storageKey: "Fgh123IjkLmn",
    },
    tags: {
      type: "hasManyThrough",
      sibling: { model: "tag", relatedField: "posts" },
      join: {
        model: "postTag",
        belongsToSelfField: "post",
        belongsToSiblingField: "tag",
      },
      storageKey: "Opq456RstUvw",
    },
  },
};
```

**No "Id" suffix for belongsTo:**

❌ Don't do this:
```typescript
// Wrong - don't add "Id" suffix to relationship names
userId: {
  type: "belongsTo",
  parent: { model: "user" },
  storageKey: "Xyz789AbcDef",
}
```

✅ Do this:
```typescript
// Correct - use the model name directly
user: {
  type: "belongsTo",
  parent: { model: "user" },
  storageKey: "Ghi012JklMno",
}
// GraphQL automatically provides both:
// - user (full record)
// - userId (just the ID)
```

## Validations

Pre-built field validations are available on fields, depending on the field type

They marked as `validations` on fields in a model's `schema.gadget.ts` file:

```typescript
import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "jellyfishing/jellyfish" model, go to https://gelly-fish.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "nGEE4pCNH9nQ",
  fields: {
    age: {
      type: "number",
      decimals: 0,
      validations: { required: true },
      storageKey: "cIzG20rsUBTa",
    },
    name: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: null, max: 80 },
      },
      storageKey: "H57Y5fh4_QXM",
    },
  },
  searchIndex: false,
};
```

Custom code validation is also an option:

```typescript
import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "fish" model, go to https://try-sign-out.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "JisNJ-67bknN",
  fields: {
    name: {
      type: "string",
      validations: {
        run: ["api/models/fish/validations/validate.ts"],
      },
      storageKey: "2THHM66GPqiV",
    },
  },
};
```

Validation files are added to a `validations` folder:

```javascript
// in validations/validate.ts
import type { FooBarFieldValidationContext } from "gadget-server";

export default async ({
  api,
  record,
  errors,
  logger,
  field,
}: FooBarFieldValidationContext) => {
  if (record.firstName && !record.lastName) {
    errors.add("lastName", "must be set if the first name is set");
  }
};
```

## When to Add Fields

### DO Add Fields For:

✅ Data that needs to persist
✅ Data that changes independently
✅ Data you need to query or filter by
✅ Data that has validations

### DON'T Add Fields For:

❌ Computed values (use Computed fields or calculate in code)
❌ Transient UI state (manage in frontend)
❌ Derived data that can be calculated from other fields

**Example:**

```typescript
// ❌ Don't store derived data - api/models/order/schema.gadget.ts
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Pqr345StuVwx",
  fields: {
    subtotal: { type: "number", decimals: 2, storageKey: "Yza678BcdEfg" },
    tax: { type: "number", decimals: 2, storageKey: "Hij901KlmNop" },
    total: { type: "number", decimals: 2, storageKey: "Qrs234TuvWxy" },  // Derived - don't store!
  },
};

// ✅ Calculate or use Computed field - api/models/order/schema.gadget.ts
import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "Zab567CdeFgh",
  fields: {
    subtotal: { type: "number", decimals: 2, storageKey: "Ijk890LmnOpq" },
    tax: { type: "number", decimals: 2, storageKey: "Rst123UvwXyz" },
    total: {
      type: "computed",
      sourceFile: "api/models/order/fields/total.gelly",
      storageKey: "Abc456DefGhi",
    },
  },
};
```

## Field Migration Workflow

When adding fields to existing models:

1. **Use `ggt add field`** command (see **gadget-cli** skill)
2. **Never manually edit** `.gadget/schema/...` files
3. **Always run `ggt dev`** during development for auto-sync

Example:
```bash
ggt add field post/publishedAt:dateTime
ggt add field post/status:enum --options=draft,published,archived
```

## Summary

**DO:**
- ✅ Use appropriate field types for your data
- ✅ Add validations where necessary
- ✅ Use camelCase names
- ✅ Add comments to fields
- ✅ Use `null` for empty states (not empty strings)
- ✅ Use enums for 2-5 fixed options

**DON'T:**
- ❌ Use JSON when you know the schema (use relationships)
- ❌ Add computed/derived data as stored fields
- ❌ Use encrypted fields for data you need to query
- ❌ Add "Id" suffix to belongsTo fields
- ❌ Default to empty strings or zero dates
- ❌ Over-validate (only add necessary validations)

**📖 More info:**
- [Field types](https://docs.gadget.dev/guides/models/fields.md)
- [Storing files](https://docs.gadget.dev/guides/models/storing-files.md)
- [Computed fields](https://docs.gadget.dev/guides/data-access/computed-fields.md)
