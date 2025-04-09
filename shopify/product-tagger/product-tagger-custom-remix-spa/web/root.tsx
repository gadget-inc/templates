import { Meta, Links, Scripts, ScrollRestoration, useLoaderData, useLocation, Outlet } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  AppType,
  Provider as GadgetProvider,
} from "@gadgetinc/react-shopify-app-bridge";
import "./app.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { Suspense } from "react";
import { api } from "./api";
import { AdaptorLink } from "./components/AdaptorLink";
import { FullPageSpinner } from "./components/FullPageSpinner";

export const links = () => [
  {
    rel: "stylesheet",
    href: polarisStyles,
  },
  {
    rel: "stylesheet",
    href: "https://assets.gadget.dev/assets/reset.min.css"
  }
];

export const meta = () => [
  { charset: "utf-8" },
  {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  },
  {
    name: "shopify-api-key",
    suppressHydrationWarning: true,
    content: "%SHOPIFY_API_KEY%"
  },
];

export const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <script suppressHydrationWarning>/* --GADGET_CONFIG-- */</script>
        <Links />
      </head>
      <body>
        <Suspense fallback={<FullPageSpinner />}>
          {children}
        </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify ?? ""}
      api={api}
      location={location}
      shopifyInstallState={window.gadgetConfig.shopifyInstallState}
    >
      <AppProvider i18n={enTranslations} linkComponent={AdaptorLink}>
        <Outlet />
      </AppProvider>
    </GadgetProvider>
  );
}

export function HydrateFallback() {
  return <FullPageSpinner />;
}