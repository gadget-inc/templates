export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { allOrders } = params;

  const options = {
    queue: {
      name: params.options?.queue?.name ?? "",
      maxConcurrency: params.options?.queue?.maxConcurrency,
    },
    retries: params.options?.retries,
  };

  if (!allOrders?.length) {
    logger.info("No orders to process");
    return;
  }

  const orders = allOrders.splice(0, 80);

  for (const { singleUseCode, customer, id } of orders) {
    await api.enqueue(
      api.sendEmail,
      { singleUseCode, email: customer?.email, orderId: id },
      options
    );
  }

  if (allOrders.length)
    await api.enqueue(api.enqueueEmails, { allOrders, options }, options);
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
  options: {
    type: "object",
    properties: {
      queue: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          maxConcurrency: {
            type: "number",
          },
        },
      },
      retries: {
        type: "number",
      },
    },
  },
};
