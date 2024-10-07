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

  logger.info({ params }, "PARAMS")

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
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
