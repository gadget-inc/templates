# ggt CLI Commands

**📖 Full docs:**
- [ggt reference](https://docs.gadget.dev/reference/ggt.md)
- [CLI](https://docs.gadget.dev/guides/development-tools/cli.md)

The `ggt` CLI is Gadget's command-line interface for local development, syncing, debugging, and app scaffolding.

## Installation

```bash
npm install -g ggt
```

Update when a new release is available:

```bash
npm install -g ggt@latest
```

## Development Workflow

**Start syncing:** Run `ggt dev` in your app directory to continuously sync local files with Gadget.
- Changes made locally -> synced to Gadget environment
- Changes made in Gadget editor -> synced to local files
- Only works with development environments
- Required for changes to take effect automatically

```bash
# Check whether sync is already active in this directory
ggt status

# Start sync only if needed
ggt dev
```

Useful notes:
- Reuse an existing `ggt dev` process if one is already running in the directory.
- Do not run `ggt push` or `ggt pull` while `ggt dev` is already syncing that directory.
- Avoid deleting or moving the whole project while `ggt dev` is active.
- Gadget sync supports Yarn v1 during synchronization.

## Scaffolding

Prefer the dedicated command groups when available:
- Use `ggt model` for model add, rename, and remove flows.
- Use `ggt action` for global and model-scoped actions.
- Keep using `ggt add` for fields, routes, environments, and namespace-disambiguated scaffolding.

### Models with `ggt model`

```bash
# Model without fields
ggt model add post

# Model with fields
ggt model add post title:string body:string published:boolean

# Namespaced model
ggt model add bigcommerce/product

# Rename or remove
ggt model rename post article
ggt model remove article --force
```

### Actions with `ggt action`

```bash
# Model-scoped action
ggt action add publish --model post
ggt action add archive --model post

# Global action
ggt action add generateReport
ggt action add sendDigest

# Namespaced action
ggt action add notifications/sendEmail
```

### Fields, routes, and environments with `ggt add`

```bash
# Add field to existing model
ggt add field post/published:boolean
ggt add field post/viewCount:number
ggt add field post/content:richText

# Namespaced models
ggt add field blogs/post/title:string

# HTTP routes (when actions aren't sufficient)
ggt add route GET-hello
ggt add route POST-webhook
ggt add route GET-api/users

# Development environments
ggt add environment dev-2 --env development
```

#### Disambiguating namespaces

If you have models and actions with the same namespace name:

```bash
# Explicitly specify model context
ggt add action model/post/audit

# Explicitly specify action namespace
ggt add action action/post/audit
```

## Quality and Diagnostics

### Checking for Problems

```bash
# Show errors/warnings in your app without deploying
ggt problems
ggt problems --app my-blog --env development
```

If there are no issues, `ggt problems` prints `No problems found.`.

### Logs and Debugging

```bash
# Show recent logs and exit
ggt logs

# Stream logs continuously
ggt logs --follow

# Focus on logs emitted by your code
ggt logs --my-logs --log-level warn

# Configure backend debugger integration
ggt debugger --configure vscode
ggt debugger --configure cursor
```

Notes:
- `ggt log` is accepted as an alias for `ggt logs`.
- `ggt debugger --configure` supports `vscode` and `cursor`.
- If `.vscode/launch.json` or `.vscode/tasks.json` already exist, merge them manually before rerunning debugger setup.

## Managing Environment Variables: `ggt var`

```bash
# List all env vars
ggt var list

# Get a specific variable
ggt var get SECRET_KEY

# Set variables
ggt var set SECRET_KEY=abc123
ggt var set KEY1=val1 KEY2=val2
ggt var set SECRET_TOKEN=xyz --secret

# Delete variables
ggt var delete SECRET_KEY
ggt var delete --all --force

# Import from another environment or .env file
ggt var import --from staging --all
ggt var import --from staging --include-values API_KEY DATABASE_URL
ggt var import --from-file .env.example --all
```

Use `--app` and `--env` flags to target a specific app/environment.

Important:
- Secret variables cannot be read back with `ggt var get`.
- `ggt var import --from` imports from another environment in the same app.
- `ggt var import --from-file` imports from a `.env` file.

## Evaluating Snippets: `ggt eval`

```bash
# Run read-only queries against your app's API client
ggt eval 'api.user.findMany()'
ggt eval --app my-app --env staging 'api.user.findFirst()'

# Allow write operations (read-only by default)
ggt eval -w 'api.user.delete("123")'
ggt eval --allow-writes 'api.user.delete("123")'

# Output as JSON
ggt eval --json 'api.widget.findMany()'
```

The snippet receives a pre-constructed `api` variable authenticated as the developer.

## Managing Environments: `ggt env`

Use `ggt env` (alias: `ggt envs`) to manage environments without an active sync context.

```bash
# List all environments
ggt env list --app my-blog

# Create empty environment
ggt env create dev-2 --app my-blog

# Clone from existing environment
ggt env create dev-2 --from development --app my-blog

# Create and immediately switch to it
ggt env create dev-2 --use --app my-blog

# Switch active environment in current sync directory (updates .gadget/sync.json)
ggt env use dev-2

# Delete environment (skip confirmation with --force)
ggt env delete dev-2 --force --app my-blog

# Unpause a paused environment
ggt env unpause dev-2 --app my-blog
```

Important:
- `ggt env use` updates `.gadget/sync.json` in the current synced directory.
- `ggt env use` cannot switch to production. Use `ggt pull --env=production` instead.

### Parallel agents with worktrees

Use one local workspace per agent and one Gadget environment per workspace to prevent environment collisions and cross-agent sync conflicts:

```bash
# 1. Create a git worktree for the agent's branch
git worktree add ../my-app-feature feature/my-feature

# 2. Create a dedicated Gadget environment for it
ggt env create feature-my-feature --from development --app my-app

# 3. Start sync in the worktree pointed at its own environment
cd ../my-app-feature
ggt dev --env feature-my-feature
```

After merging, clean up:

```bash
ggt env delete feature-my-feature --force --app my-app
git worktree remove ../my-app-feature
```

## Syncing and Deploying

`ggt add`, `ggt model`, `ggt action`, and `ggt deploy` sync before making changes. If conflicts exist, you'll be prompted to resolve them.

**When `ggt dev` is running:**
- Changes are automatically synced in both directions
- ✅ **DO NOT** use `ggt push` or `ggt pull` - changes sync automatically
- File edits are immediately reflected in your Gadget environment
- Changes in the Gadget editor are immediately pulled to local files
- If `ggt dev` reports an existing process, reuse it instead of starting another sync

**When `ggt dev` is NOT running:**

```bash
ggt push     # Push local changes to Gadget
ggt pull     # Pull Gadget changes to local
ggt status   # Check sync status (also shows if ggt dev is running)
ggt problems # Check for app errors/warnings without deploying
```

### Deploying

```bash
# Deploy from a specific environment
ggt deploy --app my-blog --from staging

# Deploy and bypass specific prompts
ggt deploy --force --allow=problems

# Deploy and skip all interactive prompts
ggt deploy --force --allow-all
```

Important deploy flags:
- `--allow-problems`
- `--allow-charges`
- `--allow-data-delete`
- `--allow-unknown-directory`
- `--allow-different-app`

## Other Useful Commands

```bash
# Open docs/editor locations in the browser
ggt open
ggt open logs
ggt open permissions
ggt open data post
ggt open schema post

# List available apps
ggt list

# Manage saved CLI defaults
ggt configure show
ggt configure change
ggt configure clear

# Generate shell completion scripts
ggt completion bash
ggt completion zsh
ggt completion fish

# Install or update agent context files
ggt agent-plugin install
ggt agent-plugin install --force
ggt agent-plugin update

# Account and version
ggt login
ggt logout
ggt whoami
ggt version
```

## Best Practices

**DO:**
- ✅ Run `ggt dev` before making changes when you want continuous syncing
- ✅ Use `ggt model` and `ggt action` instead of hand-creating model or action files
- ✅ Use singular model names (`post`, not `posts`)
- ✅ Use plural for hasMany/hasManyThrough fields (`comments`, `tags`)
- ✅ Use singular for belongsTo/hasOne fields (`author`, `post`)

**DON'T:**
- ❌ Create `id`, `createdAt`, `updatedAt` fields (auto-generated)
- ❌ Add "Model" or "Table" suffixes to model names
- ❌ Add "Id" suffix to belongsTo field names
- ❌ Run `ggt push` or `ggt pull` redundantly while `ggt dev` is already syncing the same directory

## Reference

Full documentation: [https://docs.gadget.dev/reference/ggt](https://docs.gadget.dev/reference/ggt.md)
