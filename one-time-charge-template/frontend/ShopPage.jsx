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
    <Page title="Dashboard">
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Text as="h2" variant="headingMd">
              Lorem 1
            </Text>
            <Card sectioned>
              <Text as="p" variant="bodyMd">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
                similique unde. Architecto adipisci cumque error harum unde
                vitae sunt tenetur optio porro. Odit eaque optio, quam deserunt
                at sapiente nostrum culpa, nesciunt minus accusantium adipisci,
                hic magni consequuntur voluptas quod. Culpa blanditiis ad illo
                facere ex iusto natus eum alias voluptatum accusamus voluptates
                ullam laborum beatae error, molestias dolorem dolore animi, vero
                tenetur ratione. Sequi quis minus maxime doloremque odit est
                dicta voluptas ut aliquid laudantium ea, illum, saepe voluptates
                sed quisquam deserunt voluptatibus a nisi animi officiis id
                exercitationem pariatur veniam laborum. Quo voluptates minus
                possimus laboriosam pariatur cum!
              </Text>
            </Card>
            <Card>
              <Text as="p" variant="bodyMd">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                perferendis, laborum quos modi dolore suscipit voluptates
                tenetur voluptatum earum? Autem, id.
              </Text>
            </Card>
            <Card>
              <Text as="p" variant="bodyMd">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                perferendis, laborum quos modi dolore suscipit voluptates
                tenetur voluptatum earum? Autem, id.
              </Text>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack gap="500">
            <Text as="h2" variant="headingMd">
              Lorem 2
            </Text>
            <Card>
              <BlockStack gap="500">
                <Text as="p" variant="bodyMd">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                  modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                  perferendis, laborum quos modi dolore suscipit voluptates
                  tenetur voluptatum earum? Autem, id.
                </Text>
                <Text as="p" variant="bodyMd">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                  modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                  perferendis, laborum quos modi dolore suscipit voluptates
                  tenetur voluptatum earum? Autem, id.
                </Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="500">
                <Text as="p" variant="bodyMd">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                  modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                  perferendis, laborum quos modi dolore suscipit voluptates
                  tenetur voluptatum earum? Autem, id.
                </Text>
                <Text as="p" variant="bodyMd">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                  modi eligendi itaque ab, quis consequatur. Nam fugit, magni
                  perferendis, laborum quos modi dolore suscipit voluptates
                  tenetur voluptatum earum? Autem, id.
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
