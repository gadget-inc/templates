import { Outlet } from "@remix-run/react";
import { Page, Card, Text, Box } from "@shopify/polaris";
import { NavMenu } from "../components/NavMenu";

export default function () {
  return window.gadgetConfig.shopifyInstallState ? (
    <>
      <NavMenu />
      <Outlet />
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
