import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";

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

  // Fetching the currently active plan information
  const plan = await api.plan.maybeFindFirst({
    filter: {
      current: {
        equals: true,
      },
    },
    select: {
      currency: true,
      price: true,
    },
  });

  if (plan) {
    if (plan.price <= 0) {
      throw new Error(
        "INVALID PLAN PRICE - Plan price must be a positive non-zero number"
      );
    }

    /**
     * Create AppPurchaseOneTime record in Shopify
     * Shopify requires that the price of a AppPurchaseOneTime be non-zero.
     */
    const result = await connections.shopify.current?.graphql(
      `mutation {
        appPurchaseOneTimeCreate(
          name: "one-time-charge-template",
          returnUrl: "${currentAppUrl}confirmation-callback?shop_id=${
            connections.shopify.currentShopId
          }",
          price: { 
            amount: ${plan.price},
            currencyCode: ${plan.currency}
          },
          test: ${process.env.NODE_ENV === "production" ? false : true}
        ) {
          userErrors {
            message
          }
          appPurchaseOneTime {
            createdAt
            id
          }
          confirmationUrl
        }
      }`
    );

    // Check for errors in AppPurchaseOneTime creation
    if (result?.appPurchaseOneTimeCreate?.userErrors?.length) {
      throw new Error(
        result?.appPurchaseOneTimeCreate?.userErrors[0]?.message ||
          "PURCHASE FLOW - Error creating AppPurchaseOneTime record (SHOPIFY API)"
      );
    }

    // Updating the relevant shop record fields
    record.confirmationUrl = result?.appPurchaseOneTimeCreate?.confirmationUrl;

    await save(record);
  } else {
    throw new Error("No plan found - You may need to create one");
  }
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
