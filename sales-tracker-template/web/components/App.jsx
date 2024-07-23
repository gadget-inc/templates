import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { Page, Spinner, Text } from "@shopify/polaris";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Overview, Notifications } from "../pages"
import { api } from "../api";
import { useFindFirst } from "@gadgetinc/react";
import { ShopifyShopSelect } from "../selections";

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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

function EmbeddedApp() {
  // Fetching the current shopifyShop to get configuration values
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: ShopifyShopSelect,
      live: true,
    });
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Overview
              currency={!fetchingShop && shop?.currency}
              timezone={!fetchingShop && shop?.ianaTimezone}
            />
          }
        />
        <Route
          path="/slack-notifications"
          element={
            <Notifications
              shopId={!fetchingShop && shop?.id}
              slackAccessToken={!fetchingShop && shop?.slackAccessToken}
              slackChannelId={!fetchingShop && shop?.slackChannelId}
            />
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <NavigationMenu
        navigationLinks={[
          {
            label: "Overview",
            destination: "/",
          },
          {
            label: "Slack Notifications",
            destination: "/slack-notifications",
          },
        ]}
      />
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Page title="Sales Tracker Template">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin. You may want to use this
        unauthenticated app path as a company lander / marketing and support
        space.
      </Text>
    </Page>
  );
}

export default App;
