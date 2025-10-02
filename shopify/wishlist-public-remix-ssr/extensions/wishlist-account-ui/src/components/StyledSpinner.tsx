import {
  BlockStack,
  Spinner,
} from "@shopify/ui-extensions-react/customer-account";

export default function () {
  return (
    <BlockStack inlineAlignment="center" minBlockSize={`${90}%`}>
      <Spinner size="large" appearance="monochrome" />
    </BlockStack>
  );
}
