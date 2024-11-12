import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import {
  Link,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { api } from "../api";
import AboutPage from "../routes/about";
import Index from "../routes/index";
import "./App.css";
import Reviews from "./Reviews";
import StyledSpinner from "./StyledSpinner";
import Invalid from "./Invalid";
import { AuthenticatedOrRedirect } from "../providers";

function Error404() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const appURL = process.env.GADGET_PUBLIC_SHOPIFY_APP_URL;

    if (appURL && location.pathname === new URL(appURL).pathname) {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);

  return <div>404 not found</div>;
}

export default function () {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <AuthenticatedOrRedirect>
              <Index />
            </AuthenticatedOrRedirect>
          }
        />
        <Route
          path="/about"
          element={
            <AuthenticatedOrRedirect>
              <AboutPage />
            </AuthenticatedOrRedirect>
          }
        />
        <Route path="*" element={<Error404 />} />
        <Route path="/review/:code" element={<Reviews />} />
        <Route path="/expired" element={<Invalid />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

function Layout() {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
}

function AuthenticatedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return <StyledSpinner />;
  }

  return isAuthenticated ? (
    <EmbeddedApp {...{ isAuthenticated }} />
  ) : (
    <UnauthenticatedApp {...{ isAuthenticated }} />
  );
}

function EmbeddedApp({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <>
      <Outlet context={{ isAuthenticated }} />
      <NavMenu>
        <Link to="/" rel="home">
          Shop Information
        </Link>
        <Link to="/about">About</Link>
      </NavMenu>
    </>
  );
}

function UnauthenticatedApp({ isAuthenticated }: { isAuthenticated: boolean }) {
  return <Outlet context={{ isAuthenticated }} />;
}
