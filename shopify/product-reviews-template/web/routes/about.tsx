import { Page, Text } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();

  return (
    <Page
      title="About"
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
}
