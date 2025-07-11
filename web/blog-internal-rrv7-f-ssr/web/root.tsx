import { Provider as GadgetProvider } from "@gadgetinc/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Suspense } from "react";
import { api } from "./api";
import "./app.css";
import { ErrorBoundary as DefaultGadgetErrorBoundary } from "gadget-server/react-router";
import type { GadgetConfig } from "gadget-server";
import type { Route } from "./+types/root";

export const links = () => [
  { rel: "stylesheet", href: "https://assets.gadget.dev/assets/reset.min.css" },
];

export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Gadget React Router app" },
];

export type RootOutletContext = {
  gadgetConfig: GadgetConfig;
  csrfToken: string;
};

export async function loader({ context }: Route.LoaderArgs) {
  const { session, gadgetConfig } = context;

  return {
    gadgetConfig,
    csrfToken: session?.get("csrfToken"),
  };
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig, csrfToken } = loaderData;

  return (
    <GadgetProvider api={api}>
      <Outlet context={{ gadgetConfig, csrfToken }} />
    </GadgetProvider>
  );
}

// Default Gadget error boundary component
// This can be replaced with your own custom error boundary implementation
// For more info, checkout https://reactrouter.com/how-to/error-boundary#1-add-a-root-error-boundary
export const ErrorBoundary = DefaultGadgetErrorBoundary;
