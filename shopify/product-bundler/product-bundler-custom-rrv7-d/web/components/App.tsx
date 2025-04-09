import {
  AppType,
  Provider as GadgetProvider,
  useGadget,
} from "@gadgetinc/react-shopify-app-bridge";
import { NavMenu } from "@shopify/app-bridge-react";
import { Box, Card, Page, Spinner, Text } from "@shopify/polaris";
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
} from "react-router";
import { api } from "../api";
import IndexPage from "../routes/index";
import "./App.css";
import { useFindFirst } from "@gadgetinc/react";
import Bundle from "../routes/bundle";

export type OutletContext = {
  currency: string;
  bundleCount: number;
  fetchingShop: boolean;
};

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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route
          path="/bundle/:id?"
          element={<Bundle />}
          loader={async () => {
            let variants = await api.shopifyProductVariant.findMany({
              first: 250,
              select: {
                id: true,
                product: {
                  title: true,
                },
              },
              filter: {
                title: {
                  notEquals: "Default title",
                },
              },
            });

            const allVariants = [...variants];

            while (variants.hasNextPage) {
              variants = await variants.nextPage();
              allVariants.push(...variants);
            }

            const variantMap: { [key: string]: { title: string } } = {};

            console.log("VARIANT MAP", variantMap);

            for (const variant of allVariants) {
              variantMap[variant.id] = {
                title: variant.product?.title || "Default Title",
              };
            }

            return { variantMap };
          }}
        />
        <Route path="*" element={<Error404 />} />
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
  const [{ data: shop, fetching: fetchingShop }] = useFindFirst(
    api.shopifyShop,
    {
      select: {
        currency: true,
        bundleCount: true,
      },
    }
  );

  return (
    <>
      <Outlet
        context={{
          currency: shop?.currency,
          fetchingShop,
          bundleCount: shop?.bundleCount,
        }}
      />
      <NavMenu>
        <Link to="/" rel="home">
          Shop Information
        </Link>
        <Link to="/bundle" rel="create bundle">
          Create a bundle
        </Link>
      </NavMenu>
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Page>
      <div style={{ height: "80px" }}>
        <Card padding="500">
          <Text variant="headingLg" as="h1">
            App must be viewed in the Shopify Admin
          </Text>
          <Box paddingBlockStart="200">
            <Text variant="bodyLg" as="p">
              Edit this page:{" "}
              <a
                href={`/edit/${process.env.GADGET_PUBLIC_APP_ENV}/files/web/components/App.tsx`}
              >
                web/components/App.tsx
              </a>
            </Text>
          </Box>
        </Card>
      </div>
    </Page>
  );
}

export default App;
