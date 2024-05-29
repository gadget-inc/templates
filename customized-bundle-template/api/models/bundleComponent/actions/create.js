import { applyParams, save, ActionOptions, CreateBundleComponentActionContext } from "gadget-server";

/**
 * @param { CreateBundleComponentActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  record.shop = {
    _link: connections.shopify.currentShopId
  }
  await save(record);
};

/**
 * @param { CreateBundleComponentActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
