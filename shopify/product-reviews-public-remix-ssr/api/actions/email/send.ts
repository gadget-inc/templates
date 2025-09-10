import render from "../../utils/email/render";
import pMap from "p-map";

export const run: ActionRun = async ({
  params,
  logger,
  api,
  emails,
  connections,
}) => {
  // Fetch all orders that have been fulfilled, have a requestReviewAfter date in the past,
  let orders = await api.shopifyOrder.findMany({
    first: 250,
    filter: {
      OR: [
        {
          fulfillmentStatus: {
            equals: "FULFILLED",
          },
        },
        {
          fulfillmentStatus: {
            equals: "fulfilled",
          },
        },
      ],
      requestReviewAfter: {
        lessThanOrEqual: new Date(),
      },
      email: {
        isSet: true,
      },
      reviewToken: {
        isSet: true,
      },
    },
    select: {
      id: true,
      reviewToken: true,
      email: true,
      shop: {
        myshopifyDomain: true,
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
    async ({ reviewToken, email, id, shop }) => {
      if (!email) return logger.warn({ id }, "No email found for order");

      if (!reviewToken)
        return logger.warn({ id }, "No review token found for order");

      /**
       * Send the email to the customer
       * Consider adding a custom transporter so that the email doesn't come from the app
       * For production, you should use a third party service like Mailgun, SendGrid, etc.
       */
      await emails.sendMail({
        to: email,
        subject: "Review your purchase",
        html: await render({
          shopDomain: shop?.myshopifyDomain,
          reviewToken,
        }),
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
