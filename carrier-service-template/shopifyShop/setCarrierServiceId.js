import { applyParams, preventCrossShopDataAccess, save, ActionOptions, SetCarrierServiceIdShopifyShopActionContext } from "gadget-server";

/**
 * @param { SetCarrierServiceIdShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  if (record.changed("carrierServiceId")) {
    await save(record);
  }
};

/**
 * @param { SetCarrierServiceIdShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
