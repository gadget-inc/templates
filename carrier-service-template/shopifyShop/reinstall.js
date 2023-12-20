import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifyShopState, ReinstallShopifyShopActionContext } from "gadget-server";
import { default as saveCarrierServiceId } from "./onInstallSuccess"

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { ReinstallShopifyShopActionContext } context
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
  actionType: "update",
};
