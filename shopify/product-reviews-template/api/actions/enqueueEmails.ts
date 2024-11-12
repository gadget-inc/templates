import { default as queueOptions } from "../utilities/emailQueueOptions";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { allOrders } = params;

  if (!allOrders?.length) {
    logger.info("No orders to process");
    return;
  }

  const orders = allOrders.splice(0, 80);

  for (const { singleUseCode, customer, id } of orders) {
    await api.enqueue(
      api.sendEmail,
      { singleUseCode, email: customer?.email, orderId: id },
      queueOptions
    );
  }

  if (allOrders.length)
    await api.enqueue(api.enqueueEmails, { allOrders }, queueOptions);
};

export const params = {
  allOrders: {
    type: "array",
    items: {
      type: "object",
      properties: {
        singleUseCode: {
          type: "string",
        },
        customer: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
          },
        },
        id: {
          type: "string",
        },
      },
    },
  },
};
