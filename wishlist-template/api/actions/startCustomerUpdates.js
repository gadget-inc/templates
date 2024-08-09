import { StartCustomerUpdatesGlobalActionContext } from "gadget-server";
import { uuid } from "uuidv4";

/**
 * @param { StartCustomerUpdatesGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  // Get all customers that have opted in to email marketing and have not unsubscribed in the app (unsub code not written)
  let customers = await api.shopifyCustomer.findMany({
    first: 250,
    filter: {
      emailMarketingConsent: {
        matches: {
          state: "subscribed",
        },
      },
      sendUpdateAt: {
        lessThanOrEqual: new Date(),
      },
      email: {
        isSet: true,
      },
      updateFrequencyOverride: {
        notEquals: "unsubscribed",
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      currency: true,
      wishlistCount: true,
      sendUpdateAt: true,
      updateFrequencyOverride: true,
      shop: {
        customerEmail: true,
        name: true,
        defaultUpdateFrequency: true,
        currency: true,
      },
    },
  });

  let allCustomers = customers;

  // Paginate if there are more than 250 customers
  while (customers.hasNextPage) {
    customers = await customers.nextPage();
    allCustomers = allCustomers.concat(customers);
  }

  const options = {
    queue: {
      name: `send-wishlist-emails-${uuid()}`,
      maxConcurrency: 50,
    },
    retries: 1,
  };

  if (!allCustomers.length) return;

  // Start enqueuing email sending jobs
  await api.enqueue(
    api.enqueueSendWishlistEmail,
    {
      allCustomers: allCustomers.filter((customer) => customer.wishlistCount),
      options,
    },
    options
  );
}

export const options = {
  triggers: {
    scheduler: [{ cron: "*/5 * * * *" }],
  },
};
