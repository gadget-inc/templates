import {
  Card,
  Text,
  BlockStack,
  Box,
  InlineStack,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { AutoButton } from "@gadgetinc/react/auto/polaris";
import { api } from "../api";
import { useContext, useState } from "react";
import { ShopContext } from "../providers";
import { trialCalculations } from "../utilities";

/**
 * @param { { id: string, name: string, description: string, monthlyPrice: number } } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ id, name, description, monthlyPrice, trialDays }) => {
  const { shop } = useContext(ShopContext);
  const [disabled, setDisabled] = useState(false);

  return (
    <Box maxWidth="465px">
      <Card>
        <BlockStack align="start" gap="500">
          <InlineStack align="space-between">
            <Text as="h2" variant="headingMd">
              {name}
            </Text>
            {monthlyPrice != null ? (
              <Text as="span" variant="bodyLg" fontWeight="medium">
                {monthlyPrice} {shop?.currency}
              </Text>
            ) : (
              <Box width="40%">
                <SkeletonDisplayText size="small" />
              </Box>
            )}
          </InlineStack>
          <Text as="p" variant="bodyMd">
            {description}
          </Text>
          <Text as="p" variant="bodyMd" fontWeight="medium">
            {
              trialCalculations(
                shop?.usedTrialMinutes,
                shop?.usedTrialMinutesUpdatedAt,
                new Date(),
                trialDays
              ).availableTrialDays
            }{" "}
            trial days
          </Text>
          <AutoButton
            action={api.shopifyShop.subscribe}
            disabled={shop?.plan?.id === id || disabled}
            onSuccess={(res) => {
              setDisabled(true);
              open(res.data.confirmationUrl, "_top");
            }}
            variables={{ id: shop.id, planId: id }}
            children={"Select"}
          />
        </BlockStack>
      </Card>
    </Box>
  );
};
