import {
  BlockStack,
  Spinner,
} from "@shopify/ui-extensions-react/customer-account";

export default () => {
  // A spinner component to display while loading, styled to be closer to the Shopify UI
  return (
    <BlockStack
      blockAlignment="center"
      inlineAlignment="center"
      minBlockSize={`${90}%`}
    >
      <Spinner size="large" appearance="monochrome" />
    </BlockStack>
  );
};
