import { deleteRecord, ActionOptions, DeleteQuizResultActionContext } from "gadget-server";

/**
 * @param { DeleteQuizResultActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteQuizResultActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
