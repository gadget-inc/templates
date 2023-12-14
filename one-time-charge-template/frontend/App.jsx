import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { Page, Text } from "@shopify/polaris";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ShopPage from "./ShopPage";
import { api } from "./api";
import { ShopProvider } from "./providers";
import { StyledSpinner } from "./components";

const Error404 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname ===
      new URL(process.env.GADGET_PUBLIC_SHOPIFY_APP_URL).pathname
    )
      return navigate("/", { replace: true });
  }, [location.pathname]);
  return <div>404 not found</div>;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const history = useMemo(
    () => ({ replace: (path) => navigate(path, { replace: true }) }),
    [navigate]
  );

  const appBridgeRouter = useMemo(
    () => ({
      location,
      history,
    }),
    [location, history]
  );

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
      router={appBridgeRouter}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
};

function AuthenticatedApp() {
  // we use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();
  if (loading) {
    return <StyledSpinner />;
  }
  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  return (
    <>
      <ShopProvider>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </ShopProvider>
      <NavigationMenu
        navigationLinks={[
          {
            label: "Dashboard",
            destination: "/",
          },
        ]}
      />
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Page title="App">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin.
      </Text>
    </Page>
  );
}

export default App;
