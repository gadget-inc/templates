import { applyParams, preventCrossShopDataAccess, save, UpdateShopifyProductActionContext } from "gadget-server";

/**
 * @param { UpdateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { UpdateShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};