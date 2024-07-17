import { applyParams, preventCrossShopDataAccess, save, transitionState, ActionOptions, ShopifyShopState, ReinstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};