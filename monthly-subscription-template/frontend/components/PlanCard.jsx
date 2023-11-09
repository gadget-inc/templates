import {
  Card,
  Text,
  Button,
  BlockStack,
  Box,
  InlineStack,
} from "@shopify/polaris";

/**
 * @param { { id: string, name: string, description: string, monthlyPrice: number, trialDays: number, currency: string, handleSubscribe: (planId: string) => void, buttonDisabled: boolean } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({
  id,
  name,
  description,
  monthlyPrice,
  trialDays,
  currency,
  handleSubscribe,
  buttonDisabled,
}) => {
  return (
    <Box maxWidth="465px">
      <Card>
        <BlockStack align="start" gap="500">
          <InlineStack align="space-between">
            <Text as="h2" variant="headingMd">
              {name}
            </Text>
            <Text as="span" variant="bodyLg" fontWeight="medium">
              {monthlyPrice} {currency}
            </Text>
          </InlineStack>
          <Text as="p" variant="bodyMd">
            {description}
          </Text>
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {trialDays} trial days
          </Text>
          <Button disabled={buttonDisabled} onClick={() => handleSubscribe(id)}>
            Select
          </Button>
        </BlockStack>
      </Card>
    </Box>
  );
};
