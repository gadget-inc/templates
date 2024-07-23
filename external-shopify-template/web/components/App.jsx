import {
  SignedInOrRedirect,
  SignedOut,
  SignedOutOrRedirect,
} from "@gadgetinc/react";
import { AppType, Provider } from "@gadgetinc/react-shopify-app-bridge";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
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
import "./App.css";
import { ShopProvider } from "../providers";

const App = () => {
  useEffect(() => {
    document.title = `${process.env.GADGET_APP}`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          path="dashboard"
          element={
            <SignedOutOrRedirect path="signed-in">
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
  return (
    <Provider
      type={AppType.Standalone}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      {/* Maybe add an authprovider here so that there isn't another API call when the shop provider refreshes */}
      <ShopProvider>
        <Header />
        <div className="app">
          <div className="app-content">
            <div className="main">
              <Outlet />
            </div>
          </div>
        </div>
      </ShopProvider>
    </Provider>
  );
};

const Header = () => {
  return (
    <div className="header">
      <a
        href="/"
        target="_self"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        <div className="logo">{process.env.GADGET_APP}</div>
      </a>
      <div className="header-content">
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
