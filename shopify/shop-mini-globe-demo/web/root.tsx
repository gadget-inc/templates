import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
    useLocation,
} from "react-router";
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
import { ProductionErrorBoundary, DevelopmentErrorBoundary } from "gadget-server/react-router";

import type { Route } from "./+types/root";

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
    title: "Gadget Shopify React Router app",
  },
  {
    name: "shopify-api-key",
    suppressHydrationWarning: true,
    content: "%SHOPIFY_API_KEY%"
  },
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  return { gadgetConfig: context.gadgetConfig };
};

export const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
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


export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig } = loaderData;

  const location = useLocation();

  return (
    <GadgetProvider
      type={AppType.Embedded}
      shopifyApiKey={gadgetConfig.apiKeys.shopify ?? ""}
      api={api}
      location={location}
      shopifyInstallState={gadgetConfig.shopifyInstallState}
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

// Default Gadget error boundary component
// This can be replaced with your own custom error boundary implementation
// For more info, checkout https://reactrouter.com/how-to/error-boundary#1-add-a-root-error-boundary
export const ErrorBoundary = process.env.NODE_ENV === "production" ? ProductionErrorBoundary : DevelopmentErrorBoundary;
