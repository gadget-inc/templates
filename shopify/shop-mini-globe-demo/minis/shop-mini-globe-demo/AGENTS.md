# AGENTS.md

## About This Project

This is a **Shop Mini** - a mobile-only React application that runs exclusively within the Shopify Shop App's WebView on iOS and Android devices. Shop Minis provide immersive, full-screen shopping experiences for millions of Shop app users.

### Core Characteristics

- **Mobile-only**: No desktop support - optimize exclusively for touch interfaces
- **React Native WebView**: Runs inside Shop app, not as a standalone web or native app
- **SDK-first development**: Always use @shopify/shop-minis-react components before custom solutions
- **E-commerce focused**: Built for shopping experiences with product discovery and checkout

## Development Workflow

### Initial Setup

```bash
npm install                # Install dependencies
npx shop-minis dev         # Start development server (runs shop-minis dev)
```

### Testing on Devices

When dev server is running, press:

- `i` - Open in iOS Simulator
- `a` - Open in Android Emulator
- `q` - Show QR code for physical device testing

**Important**: Always test on actual mobile simulators/devices, not just browser DevTools.

## Critical Development Rules

### 1. SDK-First Component Selection

```typescript
// ✅ ALWAYS check @shopify/shop-minis-react first
import { Button, ProductCard, List } from '@shopify/shop-minis-react'

// ❌ NEVER create custom components if SDK has equivalent
const CustomButton = () => {...}  // Wrong if SDK Button exists
```

**Component hierarchy**:

1. First choice: @shopify/shop-minis-react components
2. Fallback: Radix UI or shadcn/ui (only if not in SDK)
3. Last resort: Custom implementation

### 2. Mobile-Only Design Requirements

- **Touch targets**: Minimum 48px height for all interactive elements
- **Full-width buttons**: Use `className="w-full"` for primary actions
- **List virtualization**: Use `<List>` component for >50 items
- **Safe areas**: Use the `<SafeArea>` component to keep content clear of system UI (home indicator, navigation bar). It works like a `div`: pass classes and styles directly. For specific edges only (e.g., a sticky footer), use `edges={['bottom']}`. You can also use the `useSafeArea()` hook for pixel values or `var(--safe-area-inset-*)` CSS custom properties. **Do not use `env(safe-area-inset-*)`**: it is broken on Android. **Placement**: For apps without a router, wrap your top-level layout in `<SafeArea>`. For apps with a router, use `<SafeArea>` inside each screen/page component (not around the router itself) so each screen can control its own safe area edges independently.
- **No hover states**: Design for touch, not mouse interaction

### 3. Performance Constraints

- **Bundle size**: Maximum 5MB total
- **Load time**: Must load within 3 seconds on 5G
- **Images**: Always lazy load with SDK's `<Image>` component
- **Lists**: Always virtualize long lists with `<List>`

### 4. Storage Rules

```typescript
// ✅ Correct - Use SDK storage hooks
import {useAsyncStorage, useSecureStorage} from '@shopify/shop-minis-react'

// ❌ Wrong - Never use Web APIs
localStorage.setItem() // Will not work
sessionStorage.setItem() // Will not work
```

### 5. Navigation Patterns

#### Between pages in your mini (React Router inside MinisRouter)

```tsx
import {MinisRouter, useNavigateWithTransition} from '@shopify/shop-minis-react'
import {Routes, Route} from 'react-router'

function App() {
  return (
    <MinisRouter /* viewTransitions optional */>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </MinisRouter>
  )
}

function SomeComponent() {
  const navigate = useNavigateWithTransition() // wraps react-router navigate with view transitions
  return <button onClick={() => navigate('/products')}>Go</button>
}
```

Notes:

- Do not pass a `routes` prop to `MinisRouter`. Provide routes as children using `<Routes>` and `<Route>`.
- Any hook that uses `react-router` (e.g., `useNavigateWithTransition`) must be used within `<MinisRouter>`.

#### To Shop app screens (outside your mini)

```tsx
import {useShopNavigation} from '@shopify/shop-minis-react'

const {navigateToProduct, navigateToCart} = useShopNavigation()
```

### 6. Icon Usage

Always prefer icons over emojis for UI elements because icons render consistently across all platforms and devices.

Correct:

```bash
npx shop-minis install lucide-react
```

```tsx
import {Heart, ShoppingCart, Search} from 'lucide-react'

const Component = () => (
  <div>
    <Heart />
    <ShoppingCart />
    <Search />
  </div>
)
```

Incorrect:

```tsx
const Component = () => <div>❤️🛒🍕</div>
```

## Project Structure

```
src/
├── App.tsx           # Main component (required)
├── main.tsx          # Entry point
├── manifest.json     # Mini configuration
├── index.css         # Must import SDK styles
├── components/       # Custom components (SDK-first!)
├── hooks/           # Custom hooks
└── pages/           # Page components for routing
```

### Key Files

**src/manifest.json** (required):

```json
{
  "name": "your-mini-name",
  "permissions": [],
  "privacy_policy_url": "https://example.com/privacy",
  "terms_url": "https://example.com/terms",
  "trusted_domains": ["api.example.com"] // Optional, for external APIs
}
```

**src/index.css** (required):

```css
@import '@shopify/shop-minis-react/styles';
/* Your custom styles here */
```

## Code Style Guidelines

### TypeScript Required

- **All files must be .ts or .tsx**
- No JavaScript (.js/.jsx) files
- Use proper typing from @shopify/shop-minis-react

### Tailwind CSS v4

- Use Tailwind classes for all styling
- No inline styles unless absolutely necessary
- Mobile-first responsive design (though only mobile matters here)

### Component Patterns

```typescript
// Good: Using SDK components with proper mobile optimization
import {Button, ProductCard} from '@shopify/shop-minis-react'

function ProductList({products}) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## Testing Instructions

### Running Tests

## Common SDK Imports

```typescript
import {
  // Essential hooks
  useCurrentUser,
  useProductSearch,
  usePopularProducts,
  useShopCartActions,
  useShopNavigation,
  useAsyncStorage,
  useSecureStorage,
  useSafeArea,

  // Core components
  Button,
  ProductCard,
  MerchantCard,
  List,
  Image,
  SafeArea,

  // UI components
  Alert,
  Badge,
  Card,
  Input,
  Skeleton,

  // Navigation
  MinisRouter,
} from '@shopify/shop-minis-react'
```

## Security & Network

### API Restrictions

- Only call domains listed in `manifest.json` → `trusted_domains`
- Never include API keys or secrets in code
- Use `useGenerateUserToken()` for backend authentication

### Data Handling

- Never directly request user emails, payment info, or addresses
- Only access user data through SDK hooks
- Use `useSecureStorage()` for sensitive data

## Submission Preparation

### Pre-submission Checklist

1. **Performance**: Bundle < 5MB, loads < 3 seconds
2. **Components**: Using SDK components wherever possible
3. **Mobile**: Optimized for touch, respects safe areas
4. **Security**: No hardcoded secrets, only approved domains
5. **Manifest**: Valid privacy policy and terms URLs

### Build & Submit

```bash
shop-minis submit       # Submit for review
shop-minis check-submission  # Check status
```

## Common Pitfalls to Avoid

1. **Creating custom components when SDK has them** - Always check SDK first
2. **Using Web Storage APIs** - Use SDK storage hooks instead
3. **Designing for desktop** - This is mobile-only
4. **Small touch targets** - Keep interactive elements ≥48px
5. **Non-virtualized long lists** - Always use List component
6. **Base64 images** - Use blob URLs instead
7. **External navigation** - No links to external sites
8. **Synchronous heavy operations** - Will freeze the UI

## Additional Resources

- **SDK Docs**: https://shopify.dev/docs/api/shop-minis
- **Allowed Dependencies**: https://shopify.dev/docs/api/shop-minis/dependencies#optional-dependencies
- **Review Guidelines**: See Publishing Requirements in docs

## Quick Commands Reference

```bash
npx shop-minis dev           # Start dev server
npx shop-minis install       # Add dependencies
npx shop-minis submit        # Submit for review
npx shop-minis doctor        # Diagnose issues
npx shop-minis upgrade       # Update CLI and shop-minis-react packages
```

---

**Note**: For project setup, configuration file details, and validation commands, see **README.md**.

**Remember**: You're building for mobile devices only, inside the Shop app. Every decision should prioritize mobile UX and leverage the SDK to its fullest.
