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

export default function Index() {
  return (
    <Page title="App">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200" inlineAlign="center">
              <img src="https://assets.gadget.dev/assets/icon.svg" style={{ width: '72px', height: '72px' }} />
              <Text variant="bodyMd" as="p" alignment="center">
                Edit this page's code directly:&nbsp;
                <Link
                  url={`/edit/files/web/routes/_app._index.tsx?openShopifyOnboarding=true`}
                  target="_blank"
                  removeUnderline
                >
                  web/routes/_app._index.tsx
                </Link>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card padding="0">
            {/* use Autocomponents to build UI quickly: https://docs.gadget.dev/guides/frontend/autocomponents  */}
            <AutoTable
              //@ts-ignore
              model={api.shopifyShop}
              columns={["name", "countryName", "currency", "customerEmail"]}
            />
            <Box padding="400">
              <Text variant="bodyMd" as="p">
                Shop records fetched from:{" "}
                <Link
                  url={`/edit/model/DataModel-Shopify-Shop/data`}
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
