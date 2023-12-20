import { useFindFirst, useQuery } from "@gadgetinc/react";
import { AlphaCard, Banner, FooterHelp, HorizontalStack, Icon, Layout, Link, Page, Spinner, Text, VerticalStack } from "@shopify/polaris";
import { StoreMajor } from "@shopify/polaris-icons";
import { api } from "./api";

const gadgetMetaQuery = `
  query {
    gadgetMeta {
      slug
      editURL
    }
  }
`;

const ShopPage = () => {
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
        <Layout.Section>
          <Banner title={`${metaData.gadgetMeta.slug} is successfully connected to Shopify`} status="success" />
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <div style={{ width: "100%" }}>
              <img
                src="https://assets.gadget.dev/assets/icon.svg"
                style={{
                  margin: "14px auto",
                  height: "56px",
                }}
              />
            </div>
            <VerticalStack gap="2">
              <Text variant="headingLg" as="h1" alignment="center">
                This page is powered by{" "}
                <Link url={`${metaData.gadgetMeta.editURL}/files/frontend/ShopPage.jsx`} external>
                  <code
                    style={{
                      fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace",
                      fontSize: "0.95em",
                    }}
                  >
                    ShopPage.jsx
                  </code>
                </Link>
              </Text>
              <Text variant="bodyMd" as="p" alignment="center">
                Start building your UI by editing file hosted on Gadget.
              </Text>
            </VerticalStack>
          </AlphaCard>
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <VerticalStack gap="4">
              <Text variant="headingMd" as="h6">
                Example Shop Query from your Gadget Database
              </Text>
              <div
                style={{
                  border: "1px solid #e1e3e5",
                  padding: "12px",
                  borderRadius: "0.25rem",
                }}
              >
                <HorizontalStack align="space-between" blockAlign="center">
                  <HorizontalStack gap="4" blockAlign="center">
                    <Icon source={StoreMajor} color="highlight" backdrop />
                    <div>
                      <Text variant="headingMd" as="h6">
                        {data.name}
                      </Text>
                      <Text variant="bodyMd" as="p">
                        {data.city}, {data.countryName}
                      </Text>
                    </div>
                  </HorizontalStack>
                  <Text variant="bodyMd" as="p">
                    Created at:{" "}
                    {data.shopifyCreatedAt.toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </HorizontalStack>
              </div>
            </VerticalStack>
          </AlphaCard>
        </Layout.Section>
        <Layout.Section>
          <FooterHelp>
            <p>
              Powered by{" "}
              <Link url="https://gadget.dev" external>
                gadget.dev
              </Link>
            </p>
          </FooterHelp>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
