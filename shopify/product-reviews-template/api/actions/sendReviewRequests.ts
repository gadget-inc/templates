import { v4 as uuidv4 } from "uuid";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
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
      singleUseCode: true,
      customer: {
        email: true,
      },
    },
  });

  let allOrders = orders;

  while (orders.hasNextPage) {
    orders = await orders.nextPage();
    allOrders.push(...orders);
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
      { allOrders: allOrders.map(({ __typename, ...rest }) => rest), options },
      options
    );
};

export const options = {
  triggers: {
    scheduler: [{ every: "hour", at: "0 mins" }],
  },
};
