# Authentication

**📖 Full docs:** [docs.gadget.dev/guides/plugins/authentication](https://docs.gadget.dev/guides/plugins/authentication.md)

## Built-In Auth

Gadget provides built-in authentication with:
- Email/password login
- Google OAuth
- Session management
- User model with roles

## User Model

The `user` model includes:
- `email` - User's email
- `emailVerified` - Email verification status
- `password` - Hashed password (never exposed)
- `googleProfileId` - Google OAuth ID
- `roleList` - User's roles

**⚠️ Never modify core auth fields** - they power the auth system.

## Auth Action Parameter Shapes

**⚠️ CRITICAL:** Auth actions take **flat** parameters — do NOT nest under `{ user: { ... } }`.

### Sign Up

```javascript
// ✅ Correct — flat params
await api.user.signUp({
  email: "user@example.com",
  password: "secure-password"
});

// ❌ Wrong — nested params will cause "Variable $email was not provided" error
await api.user.signUp({
  user: { email: "user@example.com", password: "secure-password" }
});
```

### Sign In

```javascript
// ✅ Correct — flat params
await api.user.signIn({
  email: "user@example.com",
  password: "password"
});

// ❌ Wrong — nested params
await api.user.signIn({
  user: { email: "user@example.com", password: "password" }
});
```

### Sign Out

**⚠️** `signOut` requires the user's `id`:

```javascript
// ✅ Correct — must pass the user id
await api.user.signOut({ id: user.id });

// ❌ Wrong — empty object will fail
await api.user.signOut({});
```

### Verify Email / Reset Password

```javascript
await api.user.verifyEmail({ code });
await api.user.resetPassword({ code, password });
```

> **Key rule:** Auth actions (`signIn`, `signUp`, `signOut`, `verifyEmail`, `resetPassword`) use **flat params**. This is different from model CRUD actions which nest params under the model name (e.g., `{ post: { title: "..." } }`).

## Google OAuth (Frontend)

When Google OAuth is enabled in `settings.gadget.ts`, add a sign-in button that links to Gadget's built-in OAuth endpoint:

```tsx
<a href="/auth/google/start">
  <img
    src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
    width={20}
    height={20}
    alt="Google"
  />
  Continue with Google
</a>
```

**Key details:**
- The URL is always `/auth/google/start` — Gadget handles the full OAuth redirect flow
- Must use an `<a>` tag (full page navigation), NOT a button with `onClick` — OAuth requires a server redirect
- After success, Gadget redirects to the path configured in `settings.gadget.ts` → `redirectOnSignIn`
- Works for both sign-in AND sign-up — Gadget auto-creates the user on first OAuth login

## Sessions

Sessions track authenticated users:

**In actions:**
```javascript
export const run = async ({ api, session }) => {
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const currentUser = session.user;
  // Use currentUser...
};
```

## Frontend Auth State

### useUser Hook

The simplest way to get the current user in frontend components:

```tsx
import { useUser } from "@gadgetinc/react";

function Profile() {
  const user = useUser();

  // Three possible states:
  if (user === undefined) return <div>Loading...</div>;  // Still loading
  if (!user) return <div>Not logged in</div>;             // Not authenticated
  return <div>Hello, {user.email}</div>;                  // Authenticated
}
```

### useSession Hook

For accessing the full session object:

```tsx
import { useSession } from "@gadgetinc/react";

function Profile() {
  const session = useSession();

  if (!session) return <div>Not logged in</div>;

  return <div>Hello, {session.user.email}</div>;
}
```

### Auth Guard Pattern

```tsx
import { useUser } from "@gadgetinc/react";
import { useNavigate } from "react-router-dom";

function ProtectedPage() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return; // Still loading — don't redirect yet
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  if (!user) return null;
  return <div>Protected content</div>;
}
```

### Admin Role Check

```tsx
const user = useUser();
const isAdmin = user && (user as any).roles?.some(
  (role: any) => role.key === 'admin' || role.name === 'admin'
);
```

## Email Verification & Password Reset Pages

Gadget's built-in `sendVerifyEmail` and `sendResetPassword` actions generate email links pointing to `/verify-email?code=xyz` and `/reset-password?code=xyz`. You must create frontend pages to handle these:

```tsx
// Example: /verify-email page
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAction } from "@gadgetinc/react";
import { api } from "../api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [{ data, fetching, error }, verifyEmail] = useAction(api.user.verifyEmail);

  useEffect(() => {
    if (code) verifyEmail({ code });
  }, [code]);

  if (fetching) return <div>Verifying...</div>;
  if (data) return <div>Email verified!</div>;
  if (error) return <div>Verification failed</div>;
  return <div>No code provided</div>;
}
```

## Protected Routes

**Frontend:**
```tsx
export const SomePage = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* This route will be accessible only if the user is signed out */}
        <Route
          index
          element={
            <SignedOutOrRedirect>
              <Home />
            </SignedOutOrRedirect>
          }
        />
        {/* This route will be accessible only if the user is signed in */}
        <Route
          path="my-profile"
          element={
            <SignedInOrRedirect>
              <MyProfile />
            </SignedInOrRedirect>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

**Backend (routes):**
```typescript
import { preValidation, RouteHandler } from "gadget-server";

const route: RouteHandler = async ({ reply }) => {
  await reply.send("this is a protected route!");
};

route.options = {
  preValidation,
};

export default route;
```

## Shopify Auth

For Shopify apps, auth is automatic:
- Merchants authenticate via OAuth
- Session includes shop context
- `shopify-app-users` role assigned

```javascript
const shopId = connections.shopify.currentShopId;
```

## BigCommerce Auth

Similar to Shopify:
- Stores authenticate via OAuth
- Session includes store context
- `bigcommerce-app-users` role assigned

## Best Practices

- ✅ Use built-in auth system
- ✅ Check session in protected routes
- ✅ Use roles for permissions
- ✅ Never expose passwords
- ❌ Don't modify core user fields
- ❌ Don't roll your own auth
- ❌ Don't store passwords in plain text

See [access-control.md](access-control.md) for permissions.

**📖 More info:**
- [Authentication overview](https://docs.gadget.dev/guides/plugins/authentication.md)
- [Email/password auth](https://docs.gadget.dev/guides/plugins/authentication/email-pass.md)
- [Google OAuth](https://docs.gadget.dev/guides/plugins/authentication/google-oauth.md)
- [Auth workflows](https://docs.gadget.dev/guides/plugins/authentication/workflows.md)
