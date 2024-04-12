import {
  Card,
  Text,
  Button,
  BlockStack,
  Box,
  SkeletonDisplayText,
  DescriptionList,
} from "@shopify/polaris";

/**
 * @param { { id: string, name: string, description: string, pricePerOrder: number, trialDays: number, currency: string, cappedAmount: number, handleSubscribe: (planId: string) => void, buttonDisabled: boolean } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({
  id,
  name,
  description,
  pricePerOrder,
  trialDays,
  currency,
  cappedAmount,
  handleSubscribe,
  buttonDisabled,
}) => (
  <Box maxWidth="465px">
    <Card>
      <BlockStack align="start" gap="500">
        <Text as="h2" variant="headingMd">
          {name}
        </Text>
        <Text as="p" variant="bodyMd">
          {description}
        </Text>
        <DescriptionList
          items={[
            {
              term: "Price per order",
              description:
                pricePerOrder != null ? (
                  `${pricePerOrder} ${currency}`
                ) : (
                  <Box width="40%">
                    <SkeletonDisplayText size="small" />
                  </Box>
                ),
            },
            {
              term: "Capped amount",
              description: `${cappedAmount}`,
            },
            {
              term: "Trial days",
              description: `${trialDays} trial days`,
            },
          ]}
        />
        <Button disabled={buttonDisabled} onClick={() => handleSubscribe(id)}>
          Select
        </Button>
      </BlockStack>
    </Card>
  </Box>
);
