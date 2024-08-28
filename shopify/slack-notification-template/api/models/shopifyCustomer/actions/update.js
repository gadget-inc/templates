import { applyParams, preventCrossShopDataAccess, save, ActionOptions, UpdateShopifyCustomerActionContext } from "gadget-server";

/**
 * @param { UpdateShopifyCustomerActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UpdateShopifyCustomerActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};
