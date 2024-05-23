import { preventCrossShopDataAccess, deleteRecord, ActionOptions, DeleteShopifyProductActionContext } from "gadget-server";

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: false },
};
