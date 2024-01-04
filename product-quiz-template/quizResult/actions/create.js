import { applyParams, save, ActionOptions, CreateQuizResultActionContext } from "gadget-server";

/**
 * @param { CreateQuizResultActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateQuizResultActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
