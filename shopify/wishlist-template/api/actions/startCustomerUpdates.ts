import { uuid } from "uuidv4";

export type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  wishlistCount: number;
  sendUpdateAt: string | null;
  updateFrequencyOverride: string;
  shop: {
    name: string;
    defaultUpdateFrequency: string;
  };
};

export const run: ActionRun = async ({ params, logger, api, connections }) => {
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
      wishlistCount: true,
      sendUpdateAt: true,
      updateFrequencyOverride: true,
      shop: {
        name: true,
        defaultUpdateFrequency: true,
      },
    },
  });

  let allCustomers = customers;

  // Paginate if there are more than 250 customers
  while (customers.hasNextPage) {
    customers = await customers.nextPage();
    allCustomers.push(...customers);
  }

  const options = {
    queue: {
      name: `send-wishlist-emails-${uuid()}`,
      maxConcurrency: 50,
    },
    retries: 1,
  };

  if (!allCustomers.length) return;

  // No need to remove __typename as it does not exist on the type

  // Start enqueuing email sending jobs
  await api.enqueue(
    api.enqueueSendWishlistEmail,
    {
      allCustomers: allCustomers.filter(
        (customer) => customer.wishlistCount
      ) as Customer[],
      options,
    },
    options
  );
};

export const options = {
  triggers: {
    scheduler: [{ cron: "*/5 * * * *" }],
  },
};
