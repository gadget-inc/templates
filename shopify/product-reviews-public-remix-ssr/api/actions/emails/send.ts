import renderEmail from "../../utils/emails/render";
import { default as queueOptions } from "../../utils/emails/queueOptions";
import pMap from "p-map";

export const run: ActionRun = async ({
  params,
  logger,
  api,
  emails,
  currentAppUrl,
}) => {
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
      reviewToken: true,
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

  await pMap(
    allOrders,
    async ({ reviewToken, customer, id }) => {
      if (!customer?.email)
        return logger.warn("No email found for order", { id });

      if (!reviewToken)
        return logger.warn("No single use code found for order", { id });

      // Send the email to the customer
      await emails.sendMail({
        to: customer.email,
        subject: "Review your purchase",
        html: await renderEmail({ currentAppUrl, reviewToken }),
      });

      // Clear the field so we don't send the email again
      await api.internal.shopifyOrder.update(id, {
        requestReviewAfter: null,
      });
    },
    {
      concurrency: 10,
    }
  );
};

export const options = {
  triggers: {
    scheduler: [{ every: "hour", at: "0 mins" }],
  },
};
