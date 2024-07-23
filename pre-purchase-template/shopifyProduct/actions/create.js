import { applyParams, preventCrossShopDataAccess, save, ActionOptions, CreateShopifyProductActionContext } from "gadget-server";

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
