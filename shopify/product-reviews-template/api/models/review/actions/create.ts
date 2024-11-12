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
};

export const options: ActionOptions = {
  actionType: "create",
};
