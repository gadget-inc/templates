import {
  Card,
  Text,
  Button,
  BlockStack,
  InlineGrid,
  Box,
  InlineStack,
} from "@shopify/polaris";
import { useCallback } from "react";

export default ({
  id,
  name,
  description,
  monthlyPrice,
  currency,
  handleSubscribe,
  buttonDisabled,
}) => {
  const handleClick = useCallback(async () => {
    await handleSubscribe(id);
  }, [id]);

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
          <Button disabled={buttonDisabled} onClick={handleClick}>
            Select
          </Button>
        </BlockStack>
      </Card>
    </Box>
  );
};
