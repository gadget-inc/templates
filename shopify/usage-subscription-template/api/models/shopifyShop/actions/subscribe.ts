import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";
import { trialCalculations } from "../../../../utilities";

export type SubscriptionLineItems = {
  id: string;
  plan: {
    pricingDetails: {
      __typename: "AppUsagePricing";
      cappedAmount: {
        amount: string;
        currencyCode: string;
      };
      balanceUsed: {
        amount: string;
        currencyCode: string;
      };
      interval: string;
      terms: string;
    };
  };
}[];

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const planMatch = await api.plan.maybeFindOne(params.planId as string, {
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
      record.trialStartedAt as Date,
      today,
      planMatch.trialDays
    );

    const currentSubscription = await api.shopifyAppSubscription.maybeFindFirst(
      {
        filter: {
          shopId: {
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
      for (const lineItem of currentSubscription.lineItems as SubscriptionLineItems) {
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
              terms: "You will be charged ${planMatch.pricePerOrder} ${
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
      .lineItems as SubscriptionLineItems) {
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
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};

export const params = {
  // We use planName so that we don't need to fetch it
  planId: { type: "string" },
};
