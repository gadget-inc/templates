import { preventCrossShopDataAccess, deleteRecord, ActionOptions, DeleteShopifyOrderTransactionActionContext } from "gadget-server";

/**
 * @param { DeleteShopifyOrderTransactionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

/**
 * @param { DeleteShopifyOrderTransactionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
