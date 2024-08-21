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
      id: true,
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

  const options = {
    queue: {
      name: `send-wishlist-emails-${uuid()}`,
      maxConcurrency: 50,
    },
    retries: 1,
  };

  await api.enqueue(
    api.enqueueEmails,
    { allOrders: allOrders.map(({ __typeName, ...rest }) => rest) },
    { queue }
  );

  logger.info({ allOrders, date: new Date() }, "All orders");
}
