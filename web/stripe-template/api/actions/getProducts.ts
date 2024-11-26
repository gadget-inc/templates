import { stripe } from "../stripe";

type StripeProduct = {
  active: true;
  attributes: [];
  created: number;
  default_price: number | null;
  description: string | null;
  features: [];
  id: string;
  images: [];
  livemode: boolean;
  marketing_features: [];
  metadata: {};
  name: string;
  object: "product";
  package_dimensions: string | null;
  shippable: boolean | null;
  statement_descriptor: null;
  tax_code: null;
  type: string | null;
  unit_label: string | null;
  updated: number;
  url: string | null;
};

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  if (!params.userId) throw new Error("No userId provided");

  const user = await api.user.maybeFindOne(params.userId, {
    select: {
      stripeCustomerId: true,
      stripeSubscription: {
        stripeId: true,
      },
    },
  });

  let currentSubscriptionPriceId;

  if (user?.stripeSubscription?.stripeId) {
    const subscriptionResponse = await stripe.subscriptions.retrieve(
      user.stripeSubscription.stripeId
    );

    currentSubscriptionPriceId = subscriptionResponse?.items?.data[0]?.price.id;
  }

  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
  });

  logger.info({ prices }, "PRICES");

  const products: {
    [key: string]: {
      name: string;
      id: string;
      prices: {
        id: string;
        unitAmount: number;
        interval: string;
        lookupKey: string;
        current: boolean;
      }[];
    };
  } = {};

  for (const price of prices.data) {
    const product = price.product as StripeProduct;
    if (!products[product.id]) {
      products[product.id] = {
        name: product.name ?? "",
        id: product.id,
        prices: [
          {
            id: price.id,
            unitAmount: price.unit_amount ?? 0,
            interval: price.recurring?.interval ?? "",
            lookupKey: price.lookup_key ?? "",
            current: currentSubscriptionPriceId === price.id,
          },
        ],
      };
    } else {
      products[product.id].prices.push({
        id: price.id,
        unitAmount: price.unit_amount ?? 0,
        interval: price.recurring?.interval ?? "",
        lookupKey: price.lookup_key ?? "",
        current: currentSubscriptionPriceId === price.id,
      });
    }
  }

  return Object.values(products);
};

export const params = {
  userId: {
    type: "string",
  },
};
