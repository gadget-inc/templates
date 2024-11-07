export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { allCustomers, options } = params;

  if (!allCustomers?.length) return;

  // Limit the number of actions to enqueue to 50
  const customers = allCustomers.splice(0, 50);

  // Enqueue the sendWishlistEmail action for each customer
  for (const customer of customers) {
    if (options) {
      await api.enqueue(api.sendWishlistEmail, { customer }, options);
    }
  }

  // Enqueue another of the same action if there are more customers to process
  if (allCustomers.length) {
    await api.enqueue(
      api.enqueueSendWishlistEmail,
      { allCustomers, options },
      options
    );
  }
};

export const params = {
  allCustomers: {
    type: "array",
    items: {
      type: "object",
      properties: {
        email: { type: "string" },
        firstName: { type: "string" },
        id: { type: "string" },
        lastName: { type: "string" },
        sendUpdateAt: { type: "string" },
        updateFrequencyOverride: { type: "string" },
        wishlistCount: { type: "number" },
        shop: {
          type: "object",
          properties: {
            name: { type: "string" },
            defaultUpdateFrequency: { type: "string" },
          },
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
          name: { type: "string" },
          maxConcurrency: { type: "number" },
        },
      },
      retries: { type: "number" },
    },
  },
};
