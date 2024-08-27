import { deleteRecord, ActionOptions, DeleteChatActionContext } from "gadget-server";

/**
 * @param { DeleteChatActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteChatActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = { actionType: "delete", triggers: { api: true } };
