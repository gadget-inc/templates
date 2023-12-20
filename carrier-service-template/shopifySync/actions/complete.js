import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifySyncState, CompleteShopifySyncActionContext } from "gadget-server";

/**
 * @param { CompleteShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifySyncState.Running, to: ShopifySyncState.Completed });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CompleteShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
