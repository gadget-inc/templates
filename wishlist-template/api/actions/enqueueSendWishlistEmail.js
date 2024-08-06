import { EnqueueSendWishlistEmailGlobalActionContext } from "gadget-server";

/**
 * @param { EnqueueSendWishlistEmailGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { allCustomers, options } = params;

  const customers = allCustomers.splice(0, 50);

  for (const customer of customers) {
    await api.enqueue(api.sendWishlistEmail, { customer }, options);
  }

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
        id: { type: "string" },
        email: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        currency: { type: "string" },
        updateFrequencyOverride: { type: "string" },
        sendUpdateAt: { type: "string" },
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
