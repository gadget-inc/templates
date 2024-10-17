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
  const { changed, current: approved } = record.changes("approved");

  if (changed) {
    logger.info(
      {
        shopId: record.shopId,
        productId: record.productId,
        metaobjectId: record.metaobjectId,
        approved,
      },
      "HERE"
    );

    await api.enqueue(api.updateReviewsMetafield, {
      shopId: record.shopId,
      productId: record.productId,
      metaobjectId: record.metaobjectId,
      approved,
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
