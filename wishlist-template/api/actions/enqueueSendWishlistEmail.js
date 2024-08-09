import { EnqueueSendWishlistEmailGlobalActionContext } from "gadget-server";

/**
 * @param { EnqueueSendWishlistEmailGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { allCustomers, options } = params;

  // Limit the number of actions to enqueue to 50
  const customers = allCustomers.splice(0, 50);

  // Enqueue the sendWishlistEmail action for each customer
  for (const customer of customers) {
    await api.enqueue(api.sendWishlistEmail, { customer }, options);
  }

  // Enqueue another of the same action if there are more customers to process
  if (allCustomers.length) {
    await api.enqueue(
      api.enqueueSendWishlistEmail,
      { allCustomers, options },
      options
    );
  }
}

export const params = {
  allCustomers: {
    type: "array",
    items: {
      type: "object",
      properties: {
        currency: { type: "string" },
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
            customerEmail: { type: "string" },
            name: { type: "string" },
            defaultUpdateFrequency: { type: "string" },
            currency: { type: "string" },
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
