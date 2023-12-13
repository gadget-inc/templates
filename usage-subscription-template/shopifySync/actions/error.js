import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifySyncState, ErrorShopifySyncActionContext } from "gadget-server";

/**
 * @param { ErrorShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {from: ShopifySyncState.Running, to: ShopifySyncState.Errored});
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { ErrorShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
