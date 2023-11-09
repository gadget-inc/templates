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

  // Find the plan that is being requested by the user
  const planMatch = await api.plan.maybeFindOne(params.planId, {
    select: {
      id: true,
      name: true,
      monthlyPrice: true,
      currency: true,
      trialDays: true,
    },
  });

  if (planMatch) {
    const today = new Date();
    const { usedTrialDays, availableTrialDays } = calculateTrialDays(
      record.usedTrialDays || 0,
      record.usedTrialDaysUpdatedAt,
      today,
      planMatch.trialDays
    );

    const currencyConverter = new CurrencyConverter();
    const price = await currencyConverter
      .from(planMatch.currency)
      .to(record.currency)
      .convert(planMatch.monthlyPrice);

    // Make an API call to Shopify to create a charge object for both monthly and revenue charges (Make sure that the cappedAmount is talked about)
    // TODO: Add more docs links and multiline comments
    // TODO: Talk about adjusting price to the currency you wish to charge them or have one flat rate
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

    if (result?.appSubscriptionCreate?.userErrors?.length) {
      throw new Error(
        result?.appSubscriptionCreate?.userErrors[0]?.message ||
          "SUBSCRIPTION FLOW - Error creating app subscription (SHOPIFY API)"
      );
    }

    // Update this shop record to send the confirmation URL back to the frontend
    record.usedTrialDays = usedTrialDays;
    record.usedTrialDaysUpdatedAt = today;
    record.confirmationUrl = result.appSubscriptionCreate.confirmationUrl;

    await save(record);
  } else {
    throw new Error("SUBSCRIPTION FLOW - Plan not found");
  }
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
