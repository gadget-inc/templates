import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifySyncState, CompleteShopifySyncActionContext } from "gadget-server";

/**
 * @param { CompleteShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {from: ShopifySyncState.Running, to: ShopifySyncState.Completed});
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CompleteShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
