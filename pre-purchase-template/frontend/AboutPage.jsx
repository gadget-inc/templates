import { Page, Text, List, BlockStack } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="About"
      backAction={{
        content: "Shop Information",
        onAction: () => navigate("/"),
      }}
    >
      <BlockStack gap="500">
        <Text variant="bodyMd" as="p">
          This is a simple pre-purchase offer app for Shopify.
        </Text>
        <div>
          <Text variant="bodyMd" as="p">
            To use this app:
          </Text>
          <List type="bullet">
            <List.Item>select a product to be saved in this admin app</List.Item>
            <List.Item>
              <Text as="p">
                place the extension block using Shopify's checkout editor
              </Text>
              <Text as="p" fontWeight="bold">
                OR
              </Text>
              <Text as="p">
                (for development) create a Shopify CLI app and copy extension code over, run the extension
              </Text>
            </List.Item>
            <List.Item>
              go to the checkout, you will be offered your selected product
            </List.Item>
          </List>
        </div>
      </BlockStack>
    </Page>
  );
};

export default AboutPage;
