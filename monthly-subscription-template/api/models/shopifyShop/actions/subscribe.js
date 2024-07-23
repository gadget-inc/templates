import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";
import { convertCurrency } from "../../../utilities";
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
      name: true,
      monthlyPrice: true,
      currency: true,
      trialDays: true,
    },
  });

  if (planMatch) {
    const today = new Date();

    // Check for trial availability
    const { usedTrialMinutes, availableTrialDays } = trialCalculations(
      record.usedTrialMinutes,
      record.usedTrialMinutesUpdatedAt,
      today,
      planMatch.trialDays
    );

    let price = planMatch.monthlyPrice;

    if (!price) {
      throw new Error("ZERO COST PLAN - The price of a plan cannot be zero");
    }

    if (planMatch.currency != record.currency) {
      // Get cost of plan for current shop based on the plan currency
      price = await convertCurrency(
        planMatch.currency,
        record.currency,
        planMatch.monthlyPrice
      );
    }

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
      }&plan_id=${params.planId}",
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
    if (result?.appSubscriptionCreate?.userErrors?.length) {
      throw new Error(result?.appSubscriptionCreate?.userErrors[0]?.message);
    }

    // Updating the relevant shop record fields
    record.usedTrialMinutes = usedTrialMinutes;
    record.usedTrialMinutesUpdatedAt = today;
    record.activeRecurringSubscriptionId =
      result?.appSubscriptionCreate?.appSubscription?.id.split("/")[4];
    record.confirmationUrl = result?.appSubscriptionCreate?.confirmationUrl;

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
  triggers: { api: true },
};

export const params = {
  // planId is sent to this action so that we can easily fetch the plan data
  planId: { type: "string" },
};
