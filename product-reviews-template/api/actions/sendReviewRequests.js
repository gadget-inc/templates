import { SendReviewRequestsGlobalActionContext } from "gadget-server";

/**
 * @param { SendReviewRequestsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  let orders = await api.shopifyOrder.findMany({
    first: 250,
    filter: {
      fulfillmentStatus: {
        equals: "fulfilled",
      },
      requestReviewAfter: {
        lessThanOrEqual: new Date(),
      },
    },
    select: {
      lineItems: {
        edges: {
          node: {
            productId: true,
          },
        },
      },
    },
  });

  let allOrders = orders;

  while (orders.hasNextPage) {
    orders = await orders.nextPage();
    allOrders = allOrders.concat(orders);
  }
}
