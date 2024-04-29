import { BlockStack, FooterHelp, Link, Page, Text } from "@shopify/polaris";
import { useContext } from "react";
import { ShopContext } from "../providers";

export default ({
  children,
  hasNextPage,
  hasPreviousPage,
  inForm,
  saveDisabled,
  submit,
}) => {
  const { shop } = useContext(ShopContext);

  return (
    <Page
      backAction={
        inForm && shop?.bundleCount && { onAction: () => navigate("/") }
      }
      primaryAction={
        inForm && {
          content: "Save",
          disabled: saveDisabled,
          onAction: submit,
        }
      }
      pagination={
        !inForm && {
          hasPrevious: hasPreviousPage,
          hasNext: hasNextPage,
        }
      }
    >
      <BlockStack gap="500">
        {children}
        <FooterHelp align="center">
          <Text as="span" alignment="center">
            Powered by{" "}
            <Link
              target="_blank"
              monochrome
              removeUnderline
              url="https://gadget.dev"
            >
              <Text as="strong">Gadget</Text>
            </Link>
          </Text>
        </FooterHelp>
      </BlockStack>
    </Page>
  );
};
