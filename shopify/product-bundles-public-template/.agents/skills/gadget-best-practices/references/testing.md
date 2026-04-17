# Testing Setup and Strategy (Framework-Agnostic)

**📖 Setup docs (use these exact pages for implementation details):**
- [Unit and integration testing setup](https://docs.gadget.dev/guides/development-tools/unit-and-integration-testing)
- [End-to-end testing setup](https://docs.gadget.dev/guides/development-tools/e2e-testing)
- [Environment variables](https://docs.gadget.dev/guides/development-tools/environment-variables)

Use this guide for the required Gadget testing shape. Use the docs links above for framework-specific code.

## Spec-driven testing strategy

Define expected behavior before coding:
1. Write acceptance criteria in plain language.
2. Map each criterion to a test layer (unit, integration, E2E).
3. Implement tests first or alongside implementation.
4. Treat unmet criteria as incomplete work, even if code compiles.

## Required Gadget test bootstrap

1. Sync locally and keep sync running while iterating:
```bash
ggt dev
```
2. Add test scripts in `package.json`:
- `test` for unit/integration
- `test:e2e` for browser/E2E flows
3. Add local-only config to both `.ignore` and `.gitignore`:
- `.env.local` (or `.env.test`)
- E2E artifacts (`test-results/`, reports, auth-state file)
4. Create a dedicated test API key in Gadget settings (minimum role needed).
5. Create a dedicated test user for auth scenarios (do not use developer users).

## Required project test files (pattern)

Use equivalent files for your chosen framework:
- `tests/api.ts`: shared Gadget client configured from env vars.
- `tests/setup.*`: common test setup/cleanup hooks.
- `e2e/globalSetup.*`: seed/repair prerequisite data and auth state.
- `e2e/globalTeardown.*`: cleanup created test data.

For exact file examples and framework syntax, follow the setup docs linked at the top.

### Minimal unit/integration bootstrap (vitest)

```ts
// tests/api.ts
import { Client } from "@gadget-client/your-app";

export const api = new Client({
  authenticationMode: {
    apiKey: process.env.GADGET_API_KEY!,
  },
});
```

```ts
// tests/setup.ts
import { api } from "./api";

// Clean up stale test records before each run
export async function setup() {
  await api.post.deleteMany({ filter: { title: { startsWith: "[test]" } } });
}

export async function teardown() {
  await api.post.deleteMany({ filter: { title: { startsWith: "[test]" } } });
}
```

```ts
// tests/post.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { api } from "./api";
import { setup, teardown } from "./setup";

beforeAll(setup);
afterAll(teardown);

describe("post actions", () => {
  it("creates and publishes a post", async () => {
    const post = await api.post.create({ title: "[test] Hello" });
    expect(post.id).toBeDefined();

    const published = await api.post.publish(post.id);
    expect(published.publishedAt).not.toBeNull();
  });

  it("denies publish without permission", async () => {
    await expect(
      api.post.publish("nonexistent-id")
    ).rejects.toThrow();
  });
});
```

### Minimal E2E bootstrap (Playwright)

```ts
// e2e/globalSetup.ts
import { chromium, FullConfig } from "@playwright/test";
import { api } from "../tests/api";

export default async function globalSetup(_config: FullConfig) {
  // Seed a test user if not present
  const existing = await api.user.findFirst({
    filter: { email: { equals: process.env.TEST_USER_EMAIL! } },
  });
  if (!existing) {
    await api.user.signUp({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });
  }

  // Save auth state
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.APP_URL + "/sign-in");
  await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('[type="submit"]');
  await page.waitForURL("**/dashboard");
  await page.context().storageState({ path: "e2e/.auth/user.json" });
  await browser.close();
}
```

```ts
// e2e/dashboard.spec.ts
import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });

test("dashboard loads for authenticated user", async ({ page }) => {
  await page.goto(process.env.APP_URL + "/dashboard");
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
});
```

**Required `.env.test` keys** (add to `.ignore` and `.gitignore`):
```
GADGET_API_KEY=your-test-api-key
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test-password
APP_URL=https://your-app--development.gadget.app
```

## Integration and E2E data lifecycle

Use deterministic lifecycle on every run:
1. Delete stale test records from prior runs.
2. Ensure test user prerequisites (for example `emailVerified`) are valid.
3. Seed only minimal required records.
4. Run tests.
5. Cleanup test-created records.

Prefer idempotent setup/teardown so reruns are safe.

## Coverage model for Gadget apps

- Unit tests: pure helpers and isolated UI logic.
- Integration tests: actions, routes, auth behaviors, data-access rules.
- E2E tests: critical user journeys across frontend and backend.

## Scenario checklist by surface

### Actions
- Happy path with valid input.
- Validation and error path.
- Permission-denied path.
- Side effects asserted explicitly (writes, enqueueing, outbound calls).

### Routes
- Request validation and status codes.
- Authenticated vs unauthenticated behavior.
- Signature/webhook validation where applicable.

### Authentication
- Sign-in / sign-out flows.
- Protected routes and role checks.
- Session-dependent data visibility.

### Data access
- Filters, sorting, pagination behavior.
- Access control and multi-tenant isolation.
- Computed field/view expectations.
- Atomic increment/decrement behavior for shared counters.

## CI verification gates

Use this minimum gate before deploy:

```bash
# 1) framework/static checks
ggt problems

# 2) automated tests
<unit+integration command>
<e2e command as needed>
```

Fail pipeline on any `ggt problems` errors or failing tests.

## Failure triage loop

1. Reproduce with narrow scope.
2. Run `ggt problems` first.
3. Run failing test subset.
4. Inspect runtime behavior with `ggt logs`.
5. Use debugger/profiler only when logs are insufficient.
6. Add/strengthen regression tests before closing.

## Common mistakes

- Missing `.ignore`/`.gitignore` entries for local test artifacts.
- Shared mutable fixtures causing test interference.
- Using real external services in core suites.
- Relying on non-deterministic data setup.
- Skipping teardown and contaminating later runs.
