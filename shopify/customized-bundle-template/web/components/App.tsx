import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { Page, Text } from "@shopify/polaris";
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Bundles } from "../pages";
import { Spinner, UpdateForm } from ".";
import { api } from "../api";
import { ShopProvider } from "../providers";
import { CreateBundle } from "../pages";

// This component redirects users to the home page if they hit a page that doesn't exist
const Error404 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      process.env.GADGET_PUBLIC_SHOPIFY_APP_URL &&
      location.pathname ===
        new URL(process.env.GADGET_PUBLIC_SHOPIFY_APP_URL).pathname
    )
      return navigate("/", { replace: true });
  }, [location.pathname]);
  return <div>404 not found</div>;
};

export default () => {
  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      <AuthenticatedApp />
    </GadgetProvider>
  );
};

function AuthenticatedApp() {
  // We use `isAuthenticated` to render pages once the OAuth flow is complete!
  const { isAuthenticated, loading } = useGadget();

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? <EmbeddedApp /> : <UnauthenticatedApp />;
}

// The component that's displayed if the application is opened in the Shopify embedded UI
function EmbeddedApp() {
  return (
    <ShopProvider>
      <Routes>
        <Route path="/" element={<Bundles />} />
        <Route path="bundles/:bundleId" element={<UpdateForm />} />
        <Route path="/create-bundle" element={<CreateBundle />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <NavMenu>
        <a href="/" rel="home">
          Bundles
        </a>
        <a href="/create-bundle">Create</a>
      </NavMenu>
    </ShopProvider>
  );
}

// The component that's rendered if the application is not opened in the Shopify embedded UI
function UnauthenticatedApp() {
  return (
    <Page title="Unauthenticated">
      <Text variant="bodyMd" as="p">
        App can only be viewed in the Shopify Admin.
      </Text>
    </Page>
  );
}
