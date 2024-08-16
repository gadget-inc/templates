import { deleteRecord, ActionOptions, DeleteMovieActionContext } from "gadget-server";

/**
 * @param { DeleteMovieActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteMovieActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = { actionType: "delete", triggers: { api: true } };
