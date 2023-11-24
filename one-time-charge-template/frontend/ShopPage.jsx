import { BlockStack, Card, Layout, Page, Text } from "@shopify/polaris";

/**
 * This is where your main app logic should go
 * Note that this is just a skeleton of what an app might look like
 * 
 * To view the billing page, make use of your app's API Playgound. Use the following GraphQL mutation:
 * 
    mutation {
      internal {
        updateShopifyShop(
          id: "shopId",
          shopifyShop: {
            oneTimeChargeId: null,
            usedTrialMinutes: 10080
          }
        ) {
        success
        }
      }
    }
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
                  Create a plan record
                </Text>
                <Text as="p" variant="bodyMd">
                  To complete the subscription process, you must first create a
                  plan record. You can do this by navigating to your{" "}
                  <strong>plan</strong> model's <strong>create</strong> action
                  and clicking on run action on the right of the page.
                </Text>
                <Text as="p" variant="bodyMd">
                  Make sure to fill out all of the fields appropriately (making
                  sure to have a non-zero plan) and setting the{" "}
                  <strong>current</strong> field to <strong>true</strong>.
                </Text>
              </BlockStack>
            </Card>
            <Card sectioned>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Manually end the trial
                </Text>
                <Text as="p" variant="bodyMd">
                  To view the billing page you must run a mutation in your
                  Gadget app's API Playground. This mutation will set the{" "}
                  <strong>usedTrialMinutes</strong> field equal to 7 days (in
                  minutes) and make sure the the{" "}
                  <strong>oneTimeChargeId</strong> is set to{" "}
                  <strong>null</strong>.
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
    updateShopifyShop(
      id: "shopId",
      shopifyShop: {
        oneTimeChargeId: null,
        usedTrialMinutes: 10080
      }
    ) {
    success
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
