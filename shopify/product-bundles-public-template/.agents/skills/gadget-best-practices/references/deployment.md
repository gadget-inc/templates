# Deployment

**📖 Full docs:**
- [Deployment](https://docs.gadget.dev/guides/environments/deployment.md)
- [CI/CD](https://docs.gadget.dev/guides/environments/ci-cd.md)

## Environments

Gadget apps have multiple environments:

- **Development** - Your working environment
- **Production** - Live app serving real users

## Deploying to Production

**Via IDE:**
1. Click "Deploy" button in Gadget IDE
2. Review changes
3. Confirm deployment

**Via CLI:**
```bash
ggt deploy --env=production
```

## Deployment Process

1. Code is bundled and optimized
2. Database migrations run automatically
3. Environment variables copied from dev
4. App deployed to production
5. Zero-downtime deployment

## Best Practices

### Before Deploying

✅ Test in development
✅ Run automated tests if they exist
✅ Run `ggt problems` and fix framework errors
✅ Run migrations in development first
✅ Check for breaking changes
✅ Review environment variables
✅ Test with production-like data

### After Deploying

✅ Check logs for errors
✅ Monitor performance
✅ Test key user flows

## Continuous Deployment

Gate deploys with static checks and tests before promoting to production.

### GitHub Actions example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install ggt
        run: npm install -g ggt

      - name: Static checks
        run: ggt problems
        env:
          GADGET_SESSION: ${{ secrets.GADGET_SESSION }}

      - name: Unit and integration tests
        run: yarn test
        env:
          GADGET_API_KEY: ${{ secrets.GADGET_TEST_API_KEY }}

      - name: E2E tests
        run: yarn test:e2e
        env:
          GADGET_API_KEY: ${{ secrets.GADGET_TEST_API_KEY }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
          APP_URL: https://your-app--development.gadget.app

      - name: Deploy to production
        run: ggt deploy --env=production --allow-problems=false
        env:
          GADGET_SESSION: ${{ secrets.GADGET_SESSION }}
```

**Required secrets** (set in GitHub → Settings → Secrets):
- `GADGET_SESSION` — developer session token for ggt CLI authentication
- `GADGET_TEST_API_KEY` — dedicated test API key (minimum role; created in Gadget → Settings → API Keys)
- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` — dedicated test user for E2E auth flows

**📖 Full CI/CD setup:** [docs.gadget.dev/guides/environments/ci-cd](https://docs.gadget.dev/guides/environments/ci-cd.md)

## Environment Variables

Set in **Settings → Environment Variables** (separate values per environment):

- Use `GADGET_PUBLIC_*` prefix for frontend-accessible variables
- See [environments.md](environments.md) for backend vs frontend variable rules and built-in variables

## Monitoring

After deployment:
- Check **Logs** tab for errors
- Monitor **Queues** for background jobs
- Check **Ops** for performance

## Best Practices

- ✅ Deploy small, frequent changes
- ✅ Test before deploying
- ✅ Gate deploys with `ggt problems` + automated tests
- ✅ Monitor logs and metrics
- ✅ Have a rollback plan
- ❌ Don't deploy untested code
