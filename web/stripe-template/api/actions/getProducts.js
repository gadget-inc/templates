import { GetProductsGlobalActionContext } from "gadget-server";
import { stripe } from "../stripe";

/**
 * @param { GetProductsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
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

  const products = {};

  for (const price of prices.data) {
    if (!products[price.product.id]) {
      products[price.product.id] = {
        name: price.product.name,
        id: price.product.id,
        prices: [
          {
            id: price.id,
            unitAmount: price.unit_amount,
            interval: price.recurring.interval,
            lookupKey: price.lookup_key,
            current: currentSubscriptionPriceId === price.id,
          },
        ],
      };
    } else {
      products[price.product.id].prices.push({
        id: price.id,
        unitAmount: price.unit_amount,
        interval: price.recurring.interval,
        lookupKey: price.lookup_key,
        current: currentSubscriptionPriceId === price.id,
      });
    }
  }

  return Object.values(products);
}

export const params = {
  userId: {
    type: "string",
  },
};
