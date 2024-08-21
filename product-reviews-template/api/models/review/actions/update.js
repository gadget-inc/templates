import { applyParams, save, ActionOptions, UpdateReviewActionContext } from "gadget-server";

/**
 * @param { UpdateReviewActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateReviewActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Add logic to create metaobject in Shopify (if approved)
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
