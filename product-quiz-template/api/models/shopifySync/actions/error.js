import { applyParams, preventCrossShopDataAccess, save, transitionState, ActionOptions, ShopifySyncState, ErrorShopifySyncActionContext } from "gadget-server";

/**
 * @param { ErrorShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifySyncState.Running, to: ShopifySyncState.Errored });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { ErrorShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};