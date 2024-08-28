import { EnqueueEmailsGlobalActionContext } from "gadget-server";

/**
 * @param { EnqueueEmailsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { allOrders } = params;

  const orders = allOrders.splice(0, 80);

  for (const order of orders) {
    const {
      id,
      lineItems,
      customer: { email },
    } = order;

    const products = [];
    const seen = {};

    for (const { node } of lineItems.edges) {
      const { productId } = node;

      if (seen[productId]) continue;

      seen[productId] = true;
      products.push(productId);
    }

    await api.enqueue(api.sendEmail, { id, products, email }, options);
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
        id: {
          type: "string",
        },
        orderNumber: {
          type: "number",
        },
        lineItems: {
          type: "object",
          properties: {
            edges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  node: {
                    type: "object",
                    properties: {
                      productId: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
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
