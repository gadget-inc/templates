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

  // Start enqueuing email sending jobs
  await api.enqueue(
    api.enqueueSendWishlistEmail,
    {
      allCustomers: allCustomers.filter((customer) => {
        if (customer.wishlistCount) {
          // Ignoring this line because the __typename is hidden on the type but exists
          // @ts-ignore
          const { __typename, ...rest } = customer;
          return rest;
        }
      }) as Customer[],
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
