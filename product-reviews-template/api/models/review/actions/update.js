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

  const approved = record.changes("approved");

  if (approved.changed) {
    const shopify = connections.shopify.current;

    if (approved.current && !record.metaobjectId) {
      await shopify.graphql({});
    } else if (!approved.current && record.metaobjectId) {
      await shopify.graphql({});
    }
  }

  await save(record);
}

/**
 * @param { UpdateReviewActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
