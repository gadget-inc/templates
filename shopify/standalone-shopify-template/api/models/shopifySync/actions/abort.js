import { applyParams, preventCrossShopDataAccess, abortSync, save, ActionOptions, AbortShopifySyncActionContext } from "gadget-server";

/**
 * @param { AbortShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await abortSync(params, record);
  await save(record);
};

/**
 * @param { AbortShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};
