# Gadget Platform Documentation Index

**Base URL**: https://docs.gadget.dev

_This document uses TypeScript examples (`.ts`/`.tsx`). If your app uses JavaScript, change file extensions to `.js`/`.jsx` and remove TypeScript-only type annotations._

> **📖 Documentation URLs**: All doc paths support `.md` extension for raw markdown retrieval.
> Example: `https://docs.gadget.dev/guides/actions/writing-actions.md`

> **💡 For best practices and code patterns**, see the **gadget-best-practices** skill. This document provides the documentation structure; that skill provides opinionated guidance and common patterns.

## What is Gadget?

Gadget is a full-stack platform for building backends with integrated frontends. Key capabilities:
- **Backend**: Models, actions, HTTP routes, background jobs
- **Database**: PostgreSQL with auto-generated GraphQL/REST APIs
- **Frontend**: React Router v7 with SSR, loaders, and action functions | auto-generated client libraries
- **Integrations**: Native Shopify, BigCommerce, OpenAI connections
- **Deployment**: Multi-environment (dev/prod) with instant deploys

> **Fully typed**: All generated client libraries, action contexts, and route handlers are fully typed — leverage the types for autocompletion and safety.

## Core Concepts

**Model** = Database table with fields | **Action** = Function that modifies data | **Record** = Row in a model
**Field** = Column in model | **API identifier** = camelCase name for programmatic access
**Environment** = Isolated deployment (development/production) | **Connection** = Integration to external API
**HTTP Route** = Custom API endpoint | **Global Action** = Action not tied to a model
**Gelly** = Gadget's query filter language | **Background Action** = Async action triggered by events

## Documentation Structure

### GUIDES (/guides/*.md)

#### Getting Started (/guides/getting-started/*.md)
- what-is-gadget | how-to-build-a-gadget-app | how-is-gadget-different-from-x | quickstarts/web-quickstart | quickstarts/bigcommerce-quickstart

#### Models (/guides/models/*.md)
- overview | fields | storing-files | relationships | namespaces

#### Actions (/guides/actions/*.md)
- overview | types-of-actions | code | writing-actions | background-actions | background-actions/handling-timeouts | triggers | namespacing-global-actions | actions-and-api

#### HTTP Routes (/guides/http-routes/*.md)
- (overview) | route-structure | route-configuration | common-use-cases

#### Data Access (/guides/data-access/*.md)
- api | computed-fields | computed-views | gelly | (overview at /guides/data-access)
- Access control: /guides/access-control

#### Frontends (/guides/frontend/*.md)
- (overview) | building-frontends | remix-in-gadget | react-router-in-gadget | building-with-tailwind | forms | realtime-queries | shared-code | external-frontends | optimize-lcp
- autocomponents | autocomponents/polaris | autocomponents/shadcn | autocomponents/polaris-web-components

#### Authentication (/guides/plugins/authentication/*.md)
- (overview) | workflows | google-oauth | email-pass | helpers | remove-default-auth-methods

#### Plugins & Connections (/guides/plugins/*.md)

**Shopify** (/guides/plugins/shopify/*.md)
- quickstart | (overview) | building-shopify-apps | shopify-webhooks | syncing-shopify-data | non-webhook-fields-and-models | frontends | embed-previews | api-version-changelog
- advanced-topics/data-security | advanced-topics/metafields-metaobjects | advanced-topics/oauth | advanced-topics/billing | advanced-topics/shopify-app-toml | advanced-topics/extensions | advanced-topics/customer-account-ui-extensions

**BigCommerce** (/guides/plugins/bigcommerce/*.md)
- (overview) | webhooks | data | frontends | app-extensions | catalyst

**OpenAI** (/guides/plugins/openai/*.md)
- (overview) | building-ai-apps

**ChatGPT** (/guides/plugins/chatgpt.md)
- (overview)

**Other**
- (plugins overview at /guides/plugins) | extending-gadget | sentry

#### Development Tools (/guides/development-tools/*.md)
- logger | cli | environment-variables | terminal | typescript-support | unit-and-integration-testing | e2e-testing | framework-linter | rate-limits | runtime-environment | operations-dashboard | debugging-and-profiling | keyboard-shortcuts
- ai-assistant | ai-assistant/features
- working-with-agents | working-with-agents/prompt-guide | working-with-agents/working-in-parallel

#### Environments & Deployment (/guides/environments/*.md)
- (overview) | deployment | ci-cd | custom-domains | development-pausing

#### Other Guides
- source-control | templates | account-and-billing | account-and-billing/optimizing-your-bill | changelog | faq | glossary | gadget-framework

#### Tutorials (/guides/tutorials/*.md)
- automated-product-tagger | middleware | web-app
- bigcommerce | shopify
- bigcommerce/product-search-keywords | bigcommerce/size-charts
- chatgpt/todo-list
- shopify/ui-extension | shopify/theme-app-extensions

#### Framework Migrations (/guides/gadget-framework/*.md)
- v1-migration | v1-3-migration | v1-4-migration | v1-7-migration

### API REFERENCE (/api/:slug/:environmentSlug/*.md)

**Context**: Auto-generated per-app API documentation. These pages reference YOUR specific models, actions, and configuration.

- (root) | gadget-record | background-action-handle | sorting-and-filtering | errors | internal-api | api-calls-within-gadget | using-with-react
- schema/:model | schema/global-actions | schema/global-views
- external-api-calls | external-api-calls/installing | external-api-calls/authentication | external-api-calls/graphql

### PACKAGE REFERENCE (/reference/*.md)

**ggt CLI** (/reference/ggt.md)
- Commands: dev | debugger | logs | problems | eval | deploy | status | push | pull | var | model | action | add | env | configure | completion | open | list | agent-plugin | login | logout | whoami | version
- Prefer `ggt model` and `ggt action` for models and actions; use `ggt add` for fields, routes, and environments
- Use `ggt var` to manage environment variables (list/get/set/delete/import)

**Gelly Query Language** (/reference/gelly.md)
- Filter operators: equals | notEquals | in | notIn | greaterThan | lessThan | startsWith | endsWith
- Logical: and | or | not
- Functions: isSet | any | every

**gadget-server** (/reference/gadget-server.md)
- Functions: save | applyParams | deleteRecord | transitionState | globalActionContext | logger | connections
- Types: ActionContext | GlobalActionContext | RouteContext | GadgetRecord

**@gadgetinc/react** (/reference/react.md)
- Hooks: useAction | useActionForm | useFindOne | useFindMany | useGet | useMaybeFindOne | useMaybeFindMany | useMutation | useLiveQuery
- Components: Provider | SignedInOrRedirect | SignedOutOrRedirect

**@gadgetinc/preact** (/reference/preact.md)
- Preact-specific client library (similar API to React)

**@gadgetinc/react/auto** (/reference/react/auto.md)
- Components: AutoForm | AutoTable | AutoButton | AutoInput | AutoTextInput | AutoNumberInput | AutoBooleanInput | AutoFileInput | AutoRelationshipInput
- Polaris variants: PolarisAutoForm | PolarisAutoTable
- Shadcn variants: ShadcnAutoForm | ShadcnAutoTable

**@gadgetinc/react-shopify-app-bridge** (/reference/shopify-app-bridge.md)
- Components: AppBridgeProvider | useAppBridge
- Auth: useGadgetAuth | useBillingCheck

**@gadgetinc/shopify-extensions** (/reference/shopify-extensions.md)
- Hooks: useAction | useFindOne | useFindMany | useAuth
- Extension utilities for checkout/post-purchase/customer-account UI extensions

**@gadgetinc/react-bigcommerce** (/reference/react-bigcommerce.md)
- Components: BigCommerceProvider
- Hooks: useAction | useFindOne | useFindMany

**@gadgetinc/react-chatgpt-apps** (/reference/react-chatgpt-apps.md)
- Hooks: useChatGPTAuth | useAction

**Metadata files** (/reference/metadata-files.md)
- Gadget schema file definitions (schema.gadget.ts, etc.)

## Code Patterns

### Model Action Pattern
```ts
// api/models/widget/actions/create.ts
import { save, applyParams } from "gadget-server";

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await save(record);
};
```

### Global Action Pattern
```ts
// api/actions/processData.ts
export const run: GlobalActionRun = async ({ params, logger, connections }) => {
  logger.info({ params }, "Processing data");
  return { success: true };
};
```

### HTTP Route Pattern
```ts
// api/routes/GET-data.ts
export default async function route(request, reply) {
  const data = await api.widget.findMany();
  await reply.send({ data });
}
```

### Frontend Route Pattern
Routes live in `web/routes/` and are server-rendered. `context` provides access to `api` and `session`.
Forms that post to an `action` must include the `csrfToken` from outlet context as a hidden input.

```tsx
// web/routes/widgets.tsx
import { useOutletContext } from "react-router";
import type { Route } from "./+types/widgets";
import type { RootOutletContext } from "../root";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const widgets = await context.api.widget.findMany();
  return { widgets };
};

export const action = async ({ context, request }: Route.ActionArgs) => {
  const formData = await request.formData();
  await context.api.widget.create({ name: formData.get("name") as string });
  return { success: true };
};

export default function Widgets({ loaderData }: Route.ComponentProps) {
  const { widgets } = loaderData;
  const { csrfToken } = useOutletContext<RootOutletContext>();

  return (
    <>
      <form method="post">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input name="name" />
        <button type="submit">Create</button>
      </form>
      <ul>{widgets.map((w) => <li key={w.id}>{w.name}</li>)}</ul>
    </>
  );
}
```

## Common Scenarios

**Query with filters**: `api.widget.findMany({ filter: { title: { startsWith: "Hello" } } })`
**Soft delete**: Use `deleted` boolean field + access control
**File upload**: Field type = `file` | Access via `record.fileField.url`
**Relationships**: `belongsTo` (one) | `hasMany` (many) | `hasOne` (one)
**Auth**: Session stored in `request.session` | User in `request.user`
**Background jobs**: Action with `triggers: { api: true }` + `.enqueue()` method
**Shopify sync**: Auto-synced via webhooks | Manual via `shopifySync` connection
**Shopify non-webhook fields (1.6.0+)**: Configure per field with `fetchData: "onWebhook"` or `"later"` in `schema.gadget.ts`
**Environment variables**: `process.env.GADGET_ENV` = "development" | "production"
**Multi-tenancy**: Filter by `shopId` or `userId` in access control

## File Locations

- Models: `api/models/**/{modelName}/schema.gadget.ts`
- Actions: `api/models/**/{modelName}/actions/{actionName}.ts`
- Global Actions: `api/actions/**/{actionName}.ts`
- Computed Views: `api/views/**/{viewName}.gelly`
- Routes: `api/routes/{METHOD}-{path}.ts` (e.g., `GET-users-[id].ts`)
- Access Control: `api/models/**/{modelName}/access.gelly`
- Frontend: `web/` (Vite-based, react-router v7)
- Settings: `.gadget/` (environment configs, plugin settings)

## Important Behaviors

- **Auto-validation**: Fields validate before `save()` (can customize in action)
- **Auto-timestamps**: `createdAt`/`updatedAt` managed by Gadget
- **Transactions**: Model actions `run` functions transactional by default
- **Error handling**: Throw errors to return to client | Use `logger.error()` for logging
- **Session management**: Auto-managed | Access via `session` context param
- **Shopify webhooks**: Auto-registered | Auto-trigger actions on shop events

## Retrieval Instructions

**Fetching docs**: Append `.md` to any path for raw markdown. Example:
- `https://docs.gadget.dev/guides/actions/writing-actions.md`
- `https://docs.gadget.dev/reference/gadget-server.md`

**For implementation questions**: Fetch from `/guides/*.md` for conceptual overviews and patterns
**For API usage**: Fetch per-app docs from `/api/<app-slug>/<environment-slug>/*.md` or package docs from `/reference/*.md` for specific function signatures
**For Shopify**: Reference `/guides/plugins/shopify/*.md` extensively (21+ docs)
**For BigCommerce**: Reference `/guides/plugins/bigcommerce/*.md` (7 docs)
**For framework details**: Fetch `gadget-server.md` reference and action/route guides
**For client usage**: Fetch `react.md` reference and frontend guides
**For migrations**: Check framework version migration guides for breaking changes

Prefer retrieval-led reasoning. When uncertain about Gadget-specific APIs or behaviors, fetch the documentation rather than relying on general web framework knowledge.
