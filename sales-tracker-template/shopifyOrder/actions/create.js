import { applyParams, preventCrossShopDataAccess, save, ActionOptions, CreateShopifyOrderActionContext } from "gadget-server";

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, trigger }) {
  logger.info({ record, params, trigger }, "hello there")
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
