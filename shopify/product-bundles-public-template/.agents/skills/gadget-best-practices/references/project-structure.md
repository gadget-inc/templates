# Project Structure

## Gadget is Fully Hosted

**IMPORTANT:** Gadget apps are fully hosted cloud environments. Unlike traditional web development, you don't run the app locally.

### What This Means:
- ✅ **Frontend is ALWAYS running** at your preview URL (e.g., `https://app-name--development.gadget.app`)
- ✅ **Backend is ALWAYS running** in Gadget's cloud
- ✅ **Database is managed** - PostgreSQL hosted by Gadget
- ✅ **Changes sync automatically** when you use `ggt dev`

### What NOT to Do:
- ❌ Don't run `npm run dev`, `npm start`, or `npm run build`
- ❌ Don't run `yarn dev`, `yarn start`, or `yarn build`
- ❌ Don't try to run the backend locally
- ❌ Don't set up a local database
- ❌ Don't use `localhost` URLs

### What TO Do:
- ✅ Use `ggt dev` to sync local code changes to your cloud environment
- ✅ Visit the preview URL to see your running app
- ✅ Edit code locally, changes appear in the cloud automatically
- ✅ Use `ggt logs` to view backend logs
- ✅ Use `ggt problems` before commit/deploy

### Dependency Management:
- **Gadget uses Yarn** for dependency management
- ✅ Use `yarn add <package>` locally to install dependencies
- ✅ Use `yarn install` to install existing dependencies
- ✅ `ggt dev` automatically syncs package.json changes to the cloud
- ❌ Don't use `npm install` or `npm add` (use Yarn instead)

## Directory Layout

```
gadget-app/
├── api/
│   ├── models/
│   │   ├── post/
│   │   │   ├── schema.gadget.ts
│   │   │   └── actions/
│   │   │       ├── create.js
│   │   │       ├── update.js
│   │   │       ├── delete.js
│   │   │       └── publish.js
│   │   └── user/
│   ├── actions/
│   │   └── sendEmail.js
│   └── routes/
│       └── GET-hello.js
├── accessControl/
│   └── permissions.gadget.ts
├── frontend/
│   ├── App.jsx
│   ├── components/
│   └── pages/
├── .gadget/
│   └── schema/
└── package.json
```

## Key Directories

### api/models/
Models and their actions:
- `schema.gadget.ts` - Model definition
- `actions/` - Model-scoped actions

### api/actions/
Global actions (no model context)

### api/routes/
HTTP routes (custom endpoints)

### accessControl/
Role and permission definitions

### frontend/
React application code

## File Naming Conventions

**Models:** camelCase, singular
```
api/models/blogPost/
api/models/user/
```

**Actions:** camelCase
```
api/models/post/actions/publish.js
api/actions/generateReport.js
```

**Routes:** `METHOD-path.js`
```
api/routes/GET-hello.js
api/routes/POST-webhook.js
api/routes/GET-users-[id].js
```

## Generated Files

**Never manually edit:**
- `.gadget/schema/**` - Auto-generated schemas
- `.gadget/client/` - Auto-generated API client

**Always use `ggt` scaffolding commands** to modify models and fields:
- `ggt model add|rename|remove` for models
- `ggt add field` for fields

## Testing-Related Structure

- Keep automated tests close to the code they validate, or in a consistent top-level `tests/` location.
- Keep test environment files (for example `.env.test`) out of source control.
- Use dedicated seed/factory helpers to make setup and teardown deterministic.
- Keep CI and local test scripts aligned to avoid "works locally only" drift.

## Best Practices

- ✅ Use `ggt model` for models and `ggt add field` for fields
- ✅ Group related code by feature
- ✅ Keep actions focused and small
- ✅ Use descriptive file names
- ✅ Keep test setup deterministic and repeatable
- ❌ Don't edit generated files manually
- ❌ Don't nest too deeply
