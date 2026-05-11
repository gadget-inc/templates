# Shop Mini

A mobile-only React application that runs inside the Shopify Shop App.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npx shop-minis dev
```

When the dev server is running, press:
- `i` - Open in iOS Simulator
- `a` - Open in Android Emulator
- `q` - Show QR code for physical device testing

## Adding Dependencies

Always use the Shop Minis CLI to add dependencies:

```bash
npx shop-minis install <package-name>
```

**Examples:**

```bash
npx shop-minis install lucide-react
npx shop-minis install radix-ui
```

**❌ Don't use npm/yarn/pnpm directly:**

```bash
# Wrong - don't do this
npm install some-package
yarn add some-package
pnpm add some-package
```

Dependencies are validated during submission to ensure compatibility with the Shop app.

## Project Structure

```
src/
├── App.tsx           # Main component (required)
├── main.tsx          # Entry point
├── manifest.json     # Mini configuration
├── index.css         # Global styles
├── components/       # Custom components
├── hooks/           # Custom hooks
└── pages/           # Page components
```

## Protected Configuration Files

The following files in the root directory are managed by Shop Minis and should generally not be modified:

- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Linting rules
- `stylelint.config.mjs` - Style linting
- `index.html` - HTML entry point
- `package.json` - Must be modified via `npx shop-minis install` only

### ⚠️ Modifying Protected Files

While you **can** modify these files for custom configurations, be aware that:

- Changes will be flagged during submission (you'll be asked to confirm)
- Modifications may cause issues in the Shop app
- Files will be reset to template defaults during upgrades
- Changes may be rejected during review

Keep your custom files in the `src/` directory to avoid issues.

## Validation Commands

```bash
# Check if configuration files have been modified
npx shop-minis doctor

# Reset configuration files to template defaults
npx shop-minis doctor --fix

# Submit your mini for review
npx shop-minis submit
```

## Key Concepts

### Mobile-Only

This mini runs exclusively on iOS and Android devices inside the Shop app. Always design and test for mobile, not desktop.

### SDK-First Development

Always check `@shopify/shop-minis-react` for components before building custom solutions:

```typescript
import {Button, ProductCard, List} from '@shopify/shop-minis-react'
```

### Performance Requirements

- Bundle size: Maximum 5MB
- Load time: Must load within 3 seconds on 5G
- Images: Always lazy load with SDK's `<Image>` component
- Lists: Use `<List>` component for virtualization

## Common Commands

```bash
npx shop-minis dev           # Start dev server
npx shop-minis install       # Add dependencies
npx shop-minis submit        # Submit for review
npx shop-minis doctor        # Diagnose issues
npx shop-minis upgrade       # Update to latest version
```

## Learn More

- [Shop Minis Documentation](https://shopify.dev/docs/api/shop-minis)
- [Allowed Dependencies](https://shopify.dev/docs/api/shop-minis/dependencies)

## Getting Help

If you encounter issues:

1. Run `npx shop-minis doctor` to diagnose problems
2. Check the [documentation](https://shopify.dev/docs/api/shop-minis)
3. Contact Shop Minis support [forums](https://community.shopify.dev/c/shop-minis/33)

---

**Remember**: You're building for millions of Shop app users. Every decision should prioritize mobile UX and leverage the SDK to its fullest.

