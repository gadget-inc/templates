import { Page, Text } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="About"
      divider
      backAction={{
        content: "Shop Information",
        onAction: () => navigate("/"),
      }}
    >
      <Text variant="bodyMd" as="p">
        This is a simple Shopify Embedded App.
      </Text>
    </Page>
  );
};

export default AboutPage;
