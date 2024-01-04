import { applyParams, save, UpdateQuizActionContext } from "gadget-server";

/**
 * @param { UpdateQuizActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateQuizActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};