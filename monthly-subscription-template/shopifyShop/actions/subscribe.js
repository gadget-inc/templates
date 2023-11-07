import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";

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
    },
  });

  if (planMatch) {
    // Make an API call to Shopify to create a charge object for both monthly and revenue charges (Make sure that the cappedAmount is talked about)
    // TODO: Add more docs links and multiline comments
    // TODO: Talk about adjusting price to the currency you wish to charge them or have one flat rate
    const result = await connections.shopify.current?.graphql(
      `mutation {
      appSubscriptionCreate(
        name: "${planMatch.name}",
        test: ${process.env.NODE_ENV === "production" ? false : true},
        returnUrl: "${currentAppUrl}confirmation-callback?shop_id=${
        connections.shopify.currentShopId
      }&plan_id=${planMatch.id}",
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { 
                amount: ${planMatch.monthlyPrice},
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
      logger.error({
        message:
          "SUBSCRIPTION FLOW - Error creating app subscription (SHOPIFY API)",
        errors: result?.appSubscriptionCreate?.userErrors,
      });
      return;
    }

    // Update this shop record to send the confirmation URL back to the frontend
    record.confirmationUrl = result.appSubscriptionCreate.confirmationUrl;

    await save(record);
  } else {
    logger.error({
      message: "SUBSCRIPTION FLOW - Plan not found",
    });
    return;
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
