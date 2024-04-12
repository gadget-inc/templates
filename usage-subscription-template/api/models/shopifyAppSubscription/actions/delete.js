import { preventCrossShopDataAccess, deleteRecord, ActionOptions, DeleteShopifyAppSubscriptionActionContext } from "gadget-server";

/**
 * @param { DeleteShopifyAppSubscriptionActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

/**
 * @param { DeleteShopifyAppSubscriptionActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: false },
};
