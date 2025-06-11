import { default as queueOptions } from "../utils/emailQueueOptions";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { allOrders } = params;

  // Validate that there are orders to process and log a warning if not
  if (!allOrders?.length) return logger.warn("No orders to process");

  // Get a subset of orders to process in this batch
  const orders = allOrders.splice(0, 80);

  // Enqueue emails for each order
  for (const { singleUseCode, customer, id } of orders) {
    await api.enqueue(
      api.sendEmail,
      { singleUseCode, email: customer?.email, orderId: id },
      queueOptions
    );
  }

  //  If there are more orders left, enqueue them for later processing
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
