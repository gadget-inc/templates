import { applyParams, save, UpdateQuizResultActionContext } from "gadget-server";

/**
 * @param { UpdateQuizResultActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateQuizResultActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};