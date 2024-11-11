import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";
import { trialCalculations } from "../helpers";

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

  if (params.planId) {
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
      const { usedTrialMinutes } = trialCalculations(
        record.usedTrialMinutes,
        record.usedTrialMinutesUpdatedAt,
        today,
        planMatch.trialDays
      );

      if (!planMatch.monthlyPrice) {
        throw new Error("ZERO COST PLAN - The price of a plan cannot be zero");
      }

      /**
       * Create subscription record in Shopify
       * Shopify requires that the price of a subscription be non-zero. This template does not currently support free plans
       */
      const result = await connections.shopify.current?.graphql(
        `mutation ($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
            userErrors {
              message
            }
            appSubscription {
              id
            }
            confirmationUrl
          }
        }`,
        {
          test: process.env.NODE_ENV === "production" ? false : true,
          name: planMatch.name,
          returnUrl: `${currentAppUrl}confirmation-callback?shop_id=${
            connections.shopify.currentShopId
          }&plan_id=${params.planId}`,
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: {
                    amount: planMatch.monthlyPrice,
                    currencyCode: planMatch.currency,
                  },
                  interval: "EVERY_30_DAYS",
                },
              },
            },
          ],
        }
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
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};

export const params = {
  // planId is sent to this action so that we can easily fetch the plan data
  planId: { type: "string" },
};
