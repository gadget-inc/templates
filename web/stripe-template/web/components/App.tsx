import {
  SignedInOrRedirect,
  SignedIn,
  SignedOut,
  SignedOutOrRedirect,
  Provider,
  useSignOut,
} from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
  Link,
} from "react-router-dom";
import { api } from "../api";
import Index from "../routes/index";
import SignedInPage from "../routes/signed-in";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import Billing from "../routes/billing";
import { UserProvider } from "../providers";
import "./App.css";
import "./Pricing.css";

const App = () => {
  useEffect(() => {
    document.title = `Home - ${process.env.GADGET_PUBLIC_APP_SLUG} - Gadget`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <SignedOutOrRedirect>
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <SignedInPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route
          path="billing"
          element={
            <SignedInOrRedirect>
              <Billing />
            </SignedInOrRedirect>
          }
        />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Provider
      api={api}
      navigate={navigate}
      auth={window.gadgetConfig.authentication}
    >
      <UserProvider>
        <Header />
        <div className="app">
          <div className="app-content">
            <div className="main">
              <Outlet />
            </div>
          </div>
        </div>
      </UserProvider>
    </Provider>
  );
};

const Header = () => {
  const signOut = useSignOut();

  return (
    <div className="header">
      <a
        href="/"
        target="_self"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        <div className="logo">{process.env.GADGET_PUBLIC_APP_SLUG}</div>
      </a>
      <div className="header-content">
        <SignedIn>
          <Link style={{ color: "black" }} to="/">
            Home
          </Link>
          <Link style={{ color: "black" }} to="/billing">
            Billing
          </Link>
          <a onClick={signOut}>Sign out</a>
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in" style={{ color: "black" }}>
            Sign in
          </Link>
          <Link to="/sign-up" style={{ color: "black" }}>
            Sign up
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default App;
