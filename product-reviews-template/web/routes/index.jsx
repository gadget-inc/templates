import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Card,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";

export default function () {
  return (
    <Page title="App">
      <Layout>
        <Layout.Section>
          <Banner tone="success">
            <Text variant="bodyMd" as="p">
              Successfully connected your Gadget app to Shopify
            </Text>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <img
              className="gadgetLogo"
              src="https://assets.gadget.dev/assets/icon.svg"
            />
            <BlockStack gap="200">
              <Text variant="headingMd" as="h1" alignment="center">
                Edit this page:{" "}
                <Link
                  url={`/edit/${window.gadgetConfig.env.GADGET_ENV}/files/web/routes/index.jsx`}
                  target="_blank"
                  removeUnderline
                >
                  web/routes/index.jsx
                </Link>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="0">
            {/* use Autocomponents to build UI quickly: https://docs.gadget.dev/guides/frontend/autocomponents  */}
            <AutoTable
              model={api.shopifyShop}
              columns={["name", "countryName", "currency", "customerEmail"]}
            />
            <Box padding="400">
              <Text variant="headingMd" as="h6">
                Shop records fetched from:{" "}
                <Link
                  url={`/edit/${window.gadgetConfig.env.GADGET_ENV}/model/DataModel-Shopify-Shop/data`}
                  target="_blank"
                  removeUnderline
                >
                  api/models/shopifyShop/data
                </Link>
              </Text>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
