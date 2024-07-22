import { applyParams, save, ActionOptions, RunShopifySyncActionContext } from "gadget-server";
import { preventCrossShopDataAccess, shopifySync } from "gadget-server/shopify";

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
  await shopifySync(params, record);
};

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
