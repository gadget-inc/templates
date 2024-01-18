import { deleteRecord, ActionOptions, DeleteBundleActionContext } from "gadget-server";

/**
 * @param { DeleteBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
