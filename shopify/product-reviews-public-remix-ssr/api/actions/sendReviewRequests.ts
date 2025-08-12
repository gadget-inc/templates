import {
  GadgetRecordList,
  ShopifyOrder,
} from "@gadget-client/product-reviews-public-remix-ssr";
import { default as queueOptions } from "../utils/emailQueueOptions";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  // Fetch all orders that have been fulfilled, have a requestReviewAfter date in the past,
  let orders = await api.shopifyOrder.findMany({
    first: 250,
    filter: {
      fulfillmentStatus: {
        equals: "fulfilled",
      },
      requestReviewAfter: {
        lessThanOrEqual: new Date(),
      },
      customerId: {
        isSet: true,
      },
    },
    select: {
      id: true,
      singleUseCode: true,
      customer: {
        email: true,
      },
    },
  });

  const allOrders = [...orders];

  // Paginate through all orders if there are more than the initial page
  while (orders.hasNextPage) {
    orders = await orders.nextPage();
    allOrders.push(...orders);
  }

  if (!allOrders.length) return logger.warn("No orders to process");

  // Enqueue action to send emails for each order
  await api.enqueue(
    api.enqueueEmails,
    {
      allOrders: (allOrders as GadgetRecordList<ShopifyOrder>).map(
        ({ __typename, ...rest }) => rest
      ),
    },
    queueOptions
  );
};

export const options = {
  triggers: {
    scheduler: [
      { every: "hour", at: "0 mins" },
    ],
  },
};
