import { EnqueueEmailsGlobalActionContext } from "gadget-server";

/**
 * @param { EnqueueEmailsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { allOrders } = params;

  const orders = allOrders.splice(0, 80);

  for (const order of orders) {
    const { id, lineItems } = order;

    const tempArr = [];

    for (const { node } of lineItems.edges) {
      const { productId } = node;

      tempArr.push(productId);
    }

    await api.enqueue(api, {}, {});
  }
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
      },
    },
  },
};
