import { transitionState, applyParams, preventCrossShopDataAccess, abortSync, save, ActionOptions, ShopifySyncState, AbortShopifySyncActionContext } from "gadget-server";

/**
 * @param { AbortShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {from: ShopifySyncState.Running, to: ShopifySyncState.Errored});
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
  actionType: "update"
};
