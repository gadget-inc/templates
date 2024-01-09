import { applyParams, preventCrossShopDataAccess, save, ActionOptions, CreateShopifyAssetActionContext } from "gadget-server";
import { processShopifyThemeVersion } from "../utils.js";

/**
 * @param { CreateShopifyAssetActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CreateShopifyAssetActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  await processShopifyThemeVersion(record, api);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
