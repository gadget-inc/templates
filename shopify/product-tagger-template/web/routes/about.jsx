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
          This is a simple automated product tagger app for Shopify.
        </Text>
        <div>
          <Text variant="bodyMd" as="p">
            To use this app:
          </Text>
          <List type="bullet">
            <List.Item>add one or more keywords on the Keywords page</List.Item>
            <List.Item>
              update product descriptions to include the keyword
            </List.Item>
            <List.Item>
              refresh your product page - if a word in the description matches
              an entered keyword, it will be tagged with that word!
            </List.Item>
          </List>
        </div>
      </BlockStack>
    </Page>
  );
};

export default AboutPage;
