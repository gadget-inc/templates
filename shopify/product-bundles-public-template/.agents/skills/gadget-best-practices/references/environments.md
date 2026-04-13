# Environment Variables

**📖 Full docs:**
- [Environment variables](https://docs.gadget.dev/guides/development-tools/environment-variables.md)
- [Environments](https://docs.gadget.dev/guides/environments.md)

## Setting Environment Variables

**In Gadget IDE:**
1. Go to **Settings → Environment Variables**
2. Add variables for development and production
3. Save changes

**Variables are environment-specific** - development and production have separate values.

## Backend Variables

Access in actions and routes:

```javascript
export const run = async ({ logger }) => {
  const apiKey = process.env.EXTERNAL_API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  logger.info({ apiKey }, "Using API key");
};
```

**All backend variables are private** - never sent to frontend.

## Frontend Variables

Only variables prefixed with `GADGET_PUBLIC_` are available in frontend:

```javascript
// In frontend code
const apiUrl = process.env.GADGET_PUBLIC_API_URL;
const featureFlag = process.env.GADGET_PUBLIC_FEATURE_FLAG;
```

**⚠️ Frontend variables are public** - never store secrets in `GADGET_PUBLIC_*` variables.

## Built-In Variables

Gadget provides these automatically:

- `GADGET_ENV` - Current environment ("development", "production")
- `GADGET_APP` - App slug
- `NODE_ENV` - Node environment
- `GADGET_PUBLIC_APP_SLUG` - App slug (frontend)
- `GADGET_PUBLIC_APP_ENV` - Environment (frontend)

## Environment-Specific Logic

```javascript
export const run = async ({ logger }) => {
  if (process.env.GADGET_ENV === "production") {
    // Production-only code
    await sendToExternalService();
  } else {
    // Development-only code
    logger.info("Skipping in development");
  }
};
```

## Secrets Management

**DO:**
- ✅ Store API keys in environment variables
- ✅ Use different keys for dev and production
- ✅ Rotate keys regularly
- ✅ Use backend variables for secrets

**DON'T:**
- ❌ Commit secrets to code
- ❌ Use `GADGET_PUBLIC_*` for secrets
- ❌ Share production keys in Slack
- ❌ Log secret values

## Best Practices

- ✅ Use environment variables for all config
- ✅ Prefix frontend variables with `GADGET_PUBLIC_`
- ✅ Keep secrets in backend variables only
- ✅ Use different values for dev and prod
- ✅ Document required variables
- ❌ Don't hardcode config in code
- ❌ Don't expose secrets to frontend

See [deployment.md](deployment.md) for how environment variables are used in CI/CD pipelines and the deploy process.
