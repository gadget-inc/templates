import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";
import { calculateTrialDays } from "../helpers";

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function run({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const today = new Date();

  // Check for trial availability
  const { usedTrialDays, availableTrialDays } = calculateTrialDays(
    record.usedTrialDays || 0,
    record.usedTrialDaysUpdatedAt,
    today,
    planMatch.trialDays
  );

  const currencyConverter = new CurrencyConverter();
  // Get cost of plan for current shop based on the plan currency
  const price = await currencyConverter
    .from(planMatch.currency)
    .to(record.currency)
    .convert(planMatch.monthlyPrice);

  // Create subscription record in Shopify
  const result = await connections.shopify.current?.graphql(
    `mutation {
      appSubscriptionCreate(
        name: "${planMatch.name}",
        trialDays: ${availableTrialDays}
        test: ${process.env.NODE_ENV === "production" ? false : true},
        returnUrl: "${currentAppUrl}confirmation-callback?shop_id=${
      connections.shopify.currentShopId
    }&plan_id=${planMatch.id}",
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { 
                amount: ${price},
                currencyCode: ${record.currency}
              }
              interval: EVERY_30_DAYS
            }
          }
        }]
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
      }
    }`
  );

  // Check for errors in subscription creation
  if (result?.appSubscriptionCreate?.userErrors?.length) {
    throw new Error(
      result?.appSubscriptionCreate?.userErrors[0]?.message ||
        "SUBSCRIPTION FLOW - Error creating app subscription (SHOPIFY API)"
    );
  }

  // Updating the relevant shop record fields
  record.usedTrialDays = usedTrialDays;
  record.usedTrialDaysUpdatedAt = today;
  record.confirmationUrl = result.appSubscriptionCreate.confirmationUrl;

  await save(record);
}

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};

export const params = {
  // We use planName so that we don't need to fetch it
  planId: { type: "string" },
};
