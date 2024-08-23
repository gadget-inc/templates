import {
  applyParams,
  save,
  ActionOptions,
  UpdateReviewActionContext,
} from "gadget-server";

/**
 * @param { UpdateReviewActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { UpdateReviewActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const approved = record.changes("approved");

  if (approved.changed) {
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
