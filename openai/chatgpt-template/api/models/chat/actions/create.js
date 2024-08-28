import { applyParams, save, ActionOptions, CreateChatActionContext } from "gadget-server";

/**
 * @param { CreateChatActionContext } context
 */
export async function run({ params, record, logger, api, connections, session }) {
  applyParams(params, record);

  if (!record.user) {
    record.user = {
      _link: session?.get("user")
    };
  }

  await save(record);
};

/**
 * @param { CreateChatActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = { actionType: "create", triggers: { api: true } };
