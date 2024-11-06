import {
  Card,
  Text,
  BlockStack,
  Box,
  SkeletonDisplayText,
  DescriptionList,
} from "@shopify/polaris";
import { useContext, useState } from "react";
import { ShopContext } from "../providers";
import { trialCalculations } from "../utilities";
import { AutoButton } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";

export default ({
  id,
  name,
  description,
  pricePerOrder,
  trialDays,
  cappedAmount,
}: {
  id: string;
  name: string;
  description: string;
  pricePerOrder: number;
  trialDays: number;
  cappedAmount: number;
}) => {
  const { shop, currentCappedAmount } = useContext(ShopContext);
  const [disabled, setDisabled] = useState(false);

  return (
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
                    `${pricePerOrder} ${shop?.currency}`
                  ) : (
                    <Box width="40%">
                      <SkeletonDisplayText size="small" />
                    </Box>
                  ),
              },
              {
                term: "Capped amount",
                description: `${currentCappedAmount || cappedAmount}`,
              },
              {
                term: "Trial days",
                description: `${
                  trialCalculations(
                    shop?.usedTrialMinutes,
                    shop?.trialStartedAt as Date,
                    new Date(),
                    trialDays
                  ).availableTrialDays
                } trial days`,
              },
            ]}
          />
          <AutoButton
            action={api.shopifyShop.subscribe}
            disabled={shop?.plan?.id === id || disabled}
            onSuccess={(res) => {
              setDisabled(true);
              open(res.data.confirmationUrl, "_top");
            }}
            variables={{ id: shop?.id ?? "", planId: id }}
            children={"Select"}
          />
        </BlockStack>
      </Card>
    </Box>
  );
};
