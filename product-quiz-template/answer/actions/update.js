import { applyParams, save, UpdateAnswerActionContext } from "gadget-server";

/**
 * @param { UpdateAnswerActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateAnswerActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};