import { applyParams, save, ActionOptions, CreateAnswerActionContext } from "gadget-server";

/**
 * @param { CreateAnswerActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateAnswerActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
