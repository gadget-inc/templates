import { BlockStack, Layout, Page, Text, Card } from "@shopify/polaris";

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
    <Page title="Next steps">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Test the monthly subscription logic
                </Text>
                <Text as="p" variant="bodyMd">
                  Change between plans by navigating to the Plans page. The
                  page should populate like it did on intial app installation.
                  Note that this template only supports non-zero plan prices.
                  Shopify requires that you give them a positive non-zero price
                  when creating an appSubscription record.
                </Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Manually end the trial
                </Text>
                <Text as="p" variant="bodyMd">
                  You may wish to see what the ShopPage component would look
                  like once the trial is completed. To do this run the following
                  mutation. This mutation will set the{" "}
                  <strong>usedTrialMinutes</strong> field equal to 7 days (in
                  minutes). Make sure to adjust the number if you have more
                  trial days.
                </Text>
                <Text as="p" variant="bodyMd">
                  Run the following mutation in your Gadget application's API
                  Playground:
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
