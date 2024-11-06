import { BlockStack, Button, Card, Layout, Page, Text } from "@shopify/polaris";
import { useContext } from "react";
import { ShopContext } from "../providers";

export default () => {
  const { shop, gadgetMetadata } = useContext(ShopContext);

  return (
    <Page title="Next Steps">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Test the usage charge logic
                </Text>
                <Text as="p" variant="bodyMd">
                  Creating orders will run the appUsageRecord creation flow.
                  Note that with test charges, the capped amount verification
                  flow will not run. This is a Shopify limitation. We highly
                  recommend that test the usage charge flow in production before
                  releasing your app to the public.
                </Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Manually end the trial
                </Text>
                <Text as="p" variant="bodyMd">
                  You may wish to see what the shopPage would look like once the
                  trial is completed. To do this run the following mutation.
                  This mutation will set the <strong>usedTrialMinutes</strong>{" "}
                  field equal to 7 days (in minutes). Make sure to adjust the
                  number if you have more or less trial days.
                </Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    open(
                      `${gadgetMetadata?.gadgetMeta?.productionRenderURL}api/playground/javascript?code=${encodeURIComponent(`await api.internal.shopifyShop.update("${shop?.id}", {
  // Make sure to change this 1440 * number of days on the trial
  usedTrialMinutes: 10080
})`)}&environment=${gadgetMetadata?.gadgetMeta?.environmentName?.toLowerCase()}`,
                      "_blank"
                    )
                  }
                >
                  Open API Playground
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
