import { transitionState, applyParams, save, ActionOptions, ShopifyShopState, InstallShopifyShopActionContext } from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {to: ShopifyShopState.Installed});
  applyParams(params, record);
  await save(record);
};

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
