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
      // Any modifications that are initiated by Shopify and emitted via webhook will automatically be handled by your existing model actions.
      // The responsibility falls on you to redact any additional customer related data you may have in custom models.
      break;
    case "shop/redact":
      // This will be received 48 hours after a store owner uninstalls your app. Any modifications that are initiated by Shopify and emitted via webhook will automatically be handled by your existing model actions.
      // The responsibility falls on you to redact any additional shop related data you may have in custom models.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact for more information.
      break;
  }
};

/** @type { ActionOptions } */
export const options = { actionType: "create" };
