import { applyParams, preventCrossShopDataAccess, save, shopifySync, transitionState, ShopifySyncState, ActionOptions, RunShopifySyncActionContext } from "gadget-server";

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { to: ShopifySyncState.Running });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
  await shopifySync(params, record);
};

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
