import { useLoaderData, Outlet } from "@remix-run/react";
import { Page, Card, Text, Box } from "@shopify/polaris";
import { NavMenu } from "../components/NavMenu";
import { api } from "../api";

export type OutletContext = {
  currency: string;
  bundleCount: number;
};

export const clientLoader = async () => {
  return {
    shop: await api.shopifyShop.findFirst({
      select: {
        currency: true,
        bundleCount: true,
      },
    }),
  };
};

export default function () {
  const {
    shop: { currency, bundleCount },
  } = useLoaderData<typeof clientLoader>();

  return window.gadgetConfig.shopifyInstallState ? (
    <>
      <NavMenu />
      <Outlet context={{ currency, bundleCount }} />
    </>
  ) : (
    <Unauthenticated />
  );
}

const Unauthenticated = () => {
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
                href={`/edit/${window.gadgetConfig.environment}/files/web/components/App.tsx`}
              >
                web/components/App.tsx
              </a>
            </Text>
          </Box>
        </Card>
      </div>
    </Page>
  );
};
