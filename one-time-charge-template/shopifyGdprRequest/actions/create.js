import { applyParams, preventCrossShopDataAccess, save, ActionOptions, CreateShopifyGdprRequestActionContext } from "gadget-server";

/**
 * @param { CreateShopifyGdprRequestActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CreateShopifyGdprRequestActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  switch(record.topic) {
    case "customers/data_request":
      // This process is a manual one. You must provide the customer's data to the store owners directly.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request for more information.
      break;
    case "customers/redact":
      // Your Gadget Shopify connection will automatically delete all customer data in the Shopify models.
      // Use this block to redact any additional customer related data you may have kept in separate models.
      break;
    case "shop/redact":
      // This will be received 48 hours after a store owner uninstalls your app.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact for more information.
      break;
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
