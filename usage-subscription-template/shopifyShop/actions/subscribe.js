import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";
import { trialCalculations } from "../../utilities";

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
      pricePerOrder: true,
      currency: true,
      trialDays: true,
      cappedAmount: true,
    },
  });

  if (planMatch) {
    const today = new Date();

    // Check for trial availability
    const { usedTrialMinutes, availableTrialDays } = trialCalculations(
      record.usedTrialMinutes,
      record.trialStartedAt,
      today,
      planMatch.trialDays
    );

    let price = 0;

    if (planMatch.pricePerOrder) {
      const currencyConverter = new CurrencyConverter();
      // Get cost of plan for current shop based on the plan currency
      price = await currencyConverter
        .from(planMatch.currency)
        .to(record.currency)
        .convert(planMatch.pricePerOrder);
    }

    const currentSubscription = await api.shopifyAppSubscription.maybeFindFirst(
      {
        filter: {
          shop: {
            equals: record.id,
          },
          status: {
            equals: "ACTIVE",
          },
        },
        select: {
          lineItems: true,
        },
      }
    );

    let currentCappedAmount = 0;

    // Adding current capped amount to new plan's capped amount
    if (currentSubscription) {
      for (const lineItem of currentSubscription.lineItems) {
        if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
          currentCappedAmount = parseFloat(
            lineItem.plan.pricingDetails.cappedAmount.amount
          );
          break;
        }
      }
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
      }&plan_id=${planMatch.id}",
        lineItems: [{
          plan: {
            appUsagePricingDetails: {
              terms: "You will be charged ${price} ${
        record.currency
      } per order for our services."
              cappedAmount: { amount: ${
                currentCappedAmount || planMatch.cappedAmount
              }, currencyCode: ${record.currency} }
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
          lineItems {
            id
            plan {
              pricingDetails {
                __typename
              }
            }
          }
        }
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

    // Find the proper line item id. This is used later for creating usage records in Shopify
    for (const lineItem of result?.appSubscriptionCreate?.appSubscription
      .lineItems) {
      if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
        record.usagePlanId = lineItem.id;
        break;
      }
    }

    // Updating the relevant shop record fields
    record.usedTrialMinutes = usedTrialMinutes;
    record.trialStartedAt = today;
    record.activeSubscriptionId =
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
};

export const params = {
  // We use planName so that we don't need to fetch it
  planId: { type: "string" },
};
