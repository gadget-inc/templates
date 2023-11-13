import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";
import { trialCalculations } from "../helpers";

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

  const planMatch = await api.plan.maybeFindOne(params.planId, {
    select: {
      id: true,
      name: true,
      monthlyPrice: true,
      currency: true,
      trialDays: true,
    },
  });

  const currencyConverter = new CurrencyConverter();
  // Get cost of plan for current shop based on the plan currency
  const price = await currencyConverter
    .from("CAD") // Your chosen currency
    .to(record.currency)
    .convert(10); // The price for using your application

  /**
   * Create subscription record in Shopify
   * Shopify requires that the price of a subscription be non-zero. This template does not currently support free plans
   */
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
        appSubscription {
          id
        }
      }
    }`
  );

  // Check for errors in subscription creation
  if (result?.appPurchaseOneTimeCreate?.userErrors?.length) {
    throw new Error(
      result?.appPurchaseOneTimeCreate?.userErrors[0]?.message ||
        "SUBSCRIPTION FLOW - Error creating app subscription (SHOPIFY API)"
    );
  }

  // Updating the relevant shop record fields
  record.usedTrialMinutes = usedTrialMinutes;
  record.activeRecurringSubscriptionId =
    result?.appPurchaseOneTimeCreate?.appPurchaseOneTime?.id.split("/")[4];
  record.confirmationUrl = result?.appPurchaseOneTimeCreate?.confirmationUrl;

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
