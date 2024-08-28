import { applyParams, save, ActionOptions, UpdateChatActionContext } from "gadget-server";

/**
 * @param { UpdateChatActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateChatActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = { actionType: "update", triggers: { api: true } };
