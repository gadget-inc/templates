import { BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";

/**
 * This is where your main app logic should go
 * 
 * To end the trial period, make use of your app's API Playgound. Use the following GraphQL mutation:
 * 
  mutation {
    internal {
      updateShopifyShop(id: "SHOPID", shopifyShop: { usedTrialMinutes: 10800}) {
        success
        shopifyShop
      } 
    }
  }
 *
 * The above mutation should be modified to reflect the number of trial minutes for your specific plan
 * 
 */
const ShopPage = () => {
  return (
    <Page title="Next Steps">
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Card sectioned>
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
            <Card sectioned>
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
                <Text as="p" variant="bodyMd">
                  Run the following mutation in your API Playground:
                </Text>
                <Card background="bg-surface-secondary">
                  <code
                    style={{
                      whiteSpace: "break-spaces",
                    }}
                  >
                    {`mutation {
  internal {
    updateShopifyShop(id: "SHOPID", shopifyShop: { usedTrialMinutes: 10800}) {
      success
      shopifyShop
    } 
  }
}`}
                  </code>
                </Card>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
