import {
  applyParams,
  save,
  ActionOptions,
  CreateReviewActionContext,
} from "gadget-server";

/**
 * @param { CreateReviewActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  const order = await api.shopifyOrder.findOne(record.orderId, {
    select: {
      shopId: true,
      customerId: true,
    },
  });

  record.shop = {
    _link: order.shopId,
  };

  record.customer = {
    _link: order.customerId,
  };

  await save(record);
}

/**
 * @param { CreateReviewActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.enqueue(
    api.createReviewMetaobject,
    {
      shopId: record.shopId,
      review: {
        id: record.id,
        rating: record.rating,
        content: record.content,
        productId: record.productId,
      },
    },
    {
      queue: {
        name: `queue-shop:${record.shopId}`,
        maxConcurrency: 4,
      },
    }
  );
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
