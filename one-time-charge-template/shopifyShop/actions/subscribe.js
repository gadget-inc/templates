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
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const currencyConverter = new CurrencyConverter();
  // Get cost of plan for current shop based on your choice of currency
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
      appPurchaseOneTimeCreate(
        name: "one-time-charge-template",
        returnUrl: "https://${record.domain}/admin/apps/${
      record.installedViaApiKey
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

  // Check for errors in subscription creation
  if (result?.appPurchaseOneTimeCreate?.userErrors?.length) {
    throw new Error(
      result?.appPurchaseOneTimeCreate?.userErrors[0]?.message ||
        "SUBSCRIPTION FLOW - Error creating app subscription (SHOPIFY API)"
    );
  }

  // Updating the relevant shop record fields
  record.oneTimeChargeId =
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
