import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifyShopState, ReinstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed});
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
