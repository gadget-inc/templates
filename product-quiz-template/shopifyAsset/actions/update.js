import { applyParams, preventCrossShopDataAccess, save, ActionOptions, UpdateShopifyAssetActionContext } from "gadget-server";

/**
 * @param { UpdateShopifyAssetActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UpdateShopifyAssetActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  processShopifyThemeVersion(record, api);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
