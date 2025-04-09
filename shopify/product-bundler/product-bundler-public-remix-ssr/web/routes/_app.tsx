import { useLoaderData, Outlet } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Page, Card, Text, Box } from "@shopify/polaris";
import { NavMenu } from "../components/NavMenu";

export type OutletContext = {
  currency: string;
  bundleCount: number;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    gadgetConfig: context.gadgetConfig,
    shop: await context.api.shopifyShop.findFirst({
      select: {
        currency: true,
        bundleCount: true,
      },
    }),
  });
};

export default function () {
  const {
    gadgetConfig,
    shop: { currency, bundleCount },
  } = useLoaderData<typeof loader>();

  return gadgetConfig.shopifyInstallState ? (
    <>
      <NavMenu />
      <Outlet context={{ currency, bundleCount }} />
    </>
  ) : (
    <Unauthenticated />
  );
}

const Unauthenticated = () => {
  const { gadgetConfig } = useLoaderData<typeof loader>();

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
                href={`/edit/${gadgetConfig.environment}/files/web/components/App.tsx`}
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
