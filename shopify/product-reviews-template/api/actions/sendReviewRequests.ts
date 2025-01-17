import {
  GadgetRecordList,
  ShopifyOrder,
} from "@gadget-client/product-reviews-template";
import { default as queueOptions } from "../utilities/emailQueueOptions";

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
      id: true,
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

  if (allOrders.length)
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
    scheduler: [{ every: "hour", at: "0 mins" }],
  },
};
