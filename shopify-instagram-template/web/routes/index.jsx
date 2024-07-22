import { useFindFirst, useQuery } from "@gadgetinc/react";
import {
  Card,
  Banner,
  InlineStack,
  Icon,
  Layout,
  Link,
  Page,
  Spinner,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { StoreIcon } from "@shopify/polaris-icons";
import { api } from "../api";

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
      environmentSlug
    }
  }
`;

export default function () {
  const [{ data, fetching, error }] = useFindFirst(api.shopifyShop);
  const [{ data: metaData, fetching: fetchingGadgetMeta }] = useQuery({
    query: gadgetMetaQuery,
  });

  if (error) {
    return (
      <Page title="Error">
        <Text variant="bodyMd" as="p">
          Error: {error.toString()}
        </Text>
      </Page>
    );
  }

  if (fetching || fetchingGadgetMeta) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }

  return (
    <Page title="App">
      <Layout>
        <Layout.Section >
          <Banner tone="success">
            <Text variant="bodyMd" as="p">
              Successfully connected your Gadget app to Shopify
            </Text>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <div style={{ width: "100%" }}>
              <img
                src="https://assets.gadget.dev/assets/icon.svg"
                style={{
                  margin: "14px auto",
                  height: "44px",
                }}
              />
            </div>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h1" alignment="center">
                Edit this page:{" "}
                <Link url={`${metaData.gadgetMeta.editURL}/files/web/routes/index.jsx`} target="_blank" removeUnderline>
                  web/routes/index.jsx
                </Link>
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h6">
                Shop record fetched from:{" "}
                <Link url={`${metaData.gadgetMeta.editURL}/${metaData.gadgetMeta.environmentSlug}/model/DataModel-Shopify-Shop/data`} target="_blank" removeUnderline>
                    api/models/shopifyShop/data
                </Link>
              </Text>
              <div
                style={{
                  border: "1px solid #e1e3e5",
                  padding: "12px",
                  borderRadius: "0.25rem",
                }}
              >
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="400" blockAlign="center">
                    <Icon source={StoreIcon} />
                    <div>
                      <Text variant="bodyMd" as="h6">
                        {data?.name}
                      </Text>
                    </div>
                  </InlineStack>
                  <Text variant="bodyMd" as="p">
                    {data?.city && `${data.city}, `}{data?.countryName}
                  </Text>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
