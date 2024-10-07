import { EnqueueEmailsGlobalActionContext } from "gadget-server";

/**
 * @param { EnqueueEmailsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { allOrders } = params;

  const orders = allOrders.splice(0, 80);

  for (const {
    singleUseCode,
    customer: { email },
  } of orders) {
    await api.enqueue(api.sendEmail, { singleUseCode, email }, options);
  }

  if (allOrders.length)
    await api.enqueue(api.enqueueEmails, { allOrders, options }, options);
}

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
