import { transitionState, applyParams, save, ActionOptions, ShopifyShopState, InstallShopifyShopActionContext } from "gadget-server";
import { default as saveCarrierServiceId } from "./onInstallSuccess"

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  await saveCarrierServiceId({
    params,
    record,
    logger,
    api,
    connections,
    currentAppUrl,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
