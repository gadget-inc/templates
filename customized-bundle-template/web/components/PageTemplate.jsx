import {
  BlockStack,
  FooterHelp,
  Link,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useContext } from "react";
import { ShopContext } from "../providers";
import { useNavigate } from "react-router-dom";

export default ({
  children,
  hasNextPage,
  hasPreviousPage,
  inForm,
  saveDisabled,
  submit,
  title,
  handleSearchInputChange,
  searchValue,
  getNextPage,
  getPreviousPage,
}) => {
  const navigate = useNavigate();
  const { shop } = useContext(ShopContext);

  return (
    <Page
      title={title || ""}
      titleMetadata={
        !inForm && (
          <TextField
            value={searchValue}
            placeholder="Search"
            onChange={handleSearchInputChange}
            autoComplete="off"
          />
        )
      }
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
          onNext: getNextPage,
          onPrevious: getPreviousPage,
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
