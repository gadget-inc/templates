import { SendReviewRequestsGlobalActionContext } from "gadget-server";
import { v4 as uuidv4 } from "uuid";

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
      id: true,
      orderNumber: true,
      lineItems: {
        edges: {
          node: {
            productId: true,
          },
        },
      },
      customer: {
        email: true,
      },
    },
  });

  let allOrders = orders;

  while (orders.hasNextPage) {
    orders = await orders.nextPage();
    allOrders = allOrders.concat(orders);
  }

  const options = {
    queue: {
      name: `send-wishlist-emails-${uuidv4()}`,
      maxConcurrency: 50,
    },
    retries: 1,
  };

  if (allOrders.length)
    await api.enqueue(
      api.enqueueEmails,
      { allOrders: allOrders.map(({ __typeName, ...rest }) => rest), options },
      options
    );
}
