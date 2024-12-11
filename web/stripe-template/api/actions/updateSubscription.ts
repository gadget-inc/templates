import { stripe } from "../stripe";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { subscriptionId, priceId } = params;

  if (!subscriptionId) throw new Error("No subscriptionId provided");
  if (!priceId) throw new Error("No priceId provided");

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (!subscription) throw new Error("No subscription found");

  const updatedSubscription = await stripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    }
  );

  if (!updatedSubscription) throw new Error("Failed to update subscription");

  return { status: "ok" };
};

export const params = {
  subscriptionId: {
    type: "string",
  },
  priceId: { type: "string" },
};
