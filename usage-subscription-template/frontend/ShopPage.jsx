import {
  BlockStack,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonPage,
} from "@shopify/polaris";

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
    <SkeletonPage title="Dashboard" primaryAction>
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Images">
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Variants">
              <SkeletonBodyText />
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack gap="500">
            <Card title="Sales channels">
              <BlockStack gap="500">
                <SkeletonBodyText lines={2} />
                <SkeletonBodyText lines={1} />
              </BlockStack>
            </Card>
            <Card title="Organization" subdued>
              <BlockStack gap="500">
                <SkeletonBodyText lines={2} />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default ShopPage;
