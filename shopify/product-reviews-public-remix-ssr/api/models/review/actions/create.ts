import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);

  const order = await api.shopifyOrder.findOne(record.orderId, {
    select: {
      shopId: true,
      customerId: true,
    },
  });

  // @ts-ignore
  record.shop = {
    _link: order.shopId,
  };

  // @ts-ignore
  record.customer = {
    _link: order.customerId,
  };

  if (!record.lineItemId) throw new Error("Line item not provided");

  await api.internal.shopifyOrderLineItem.update(record.lineItemId, {
    reviewCreated: true,
  });

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await api.enqueue(
    api.createReviewMetaobject,
    {
      // @ts-ignore
      shopId: record.shop,
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

  const order = await api.shopifyOrder.findOne(record.orderId, {
    select: {
      reviewCreationLimitReached: true,
    },
  });

  if (order?.reviewCreationLimitReached) {
    await api.internal.shopifyOrder.update(record.orderId, {
      singleUseCode: null,
    });
  }
};

export const options: ActionOptions = {
  actionType: "create",
};
