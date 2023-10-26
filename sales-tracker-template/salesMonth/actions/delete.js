import { deleteRecord, ActionOptions, DeleteMonthActionContext } from "gadget-server";

/**
 * @param { DeleteMonthActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteMonthActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
