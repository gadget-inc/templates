import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SubscribeShopifyShopActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

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
    let price = plan.price;

    if (price <= 0) {
      throw new Error(
        "INVALID PLAN PRICE - Plan price must be a positive non-zero number"
      );
    }

    if (plan.currency !== record.currency) {
      const currencyConverter = new CurrencyConverter();
      // Get cost of payment for current shop based on your choice of currency
      price = await currencyConverter
        .from(plan.currency)
        .to(record.currency)
        .convert(plan.price); // Must be non-zero
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
          amount: ${price},
          currencyCode: ${record.currency}
        },
        test: ${process.env.NODE_ENV === "production" ? false : true}
      ) {
        userErrors {
          field
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
