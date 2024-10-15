import { RouteContext } from "gadget-server";
import { stripe } from "../stripe";

/**
 * Route handler for GET subscription-callback
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}) {
  const { query } = request;

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    query.session_id
  );

  logger.info({ checkoutSession }, "checkoutSession");

  const customerId = checkoutSession.customer;

  const updatedUser = { stripeCustomerId: customerId };

  const subscriptions = await api.stripe.subscription.findMany({
    filter: { userId: { equals: query.user_id }, status: { equals: "active" } },
    select: { stripeId: true },
  });

  if (subscriptions.length) {
    for (const subscription of subscriptions) {
      // Call stripe to unsub the customer from the other active subscriptions
      await stripe.subscriptions.cancel(subscription.stripeId);
    }
  }

  const subscription = await api.stripe.subscription.maybeFindFirst({
    filter: {
      customerId: { equals: customerId },
      status: { equals: "active" },
    },
    select: { id: true },
  });

  if (subscription) {
    updatedUser["stripeSubscription"] = {
      update: {
        id: subscription.id,
      },
    };
  }

  await api.user.update(query.user_id, updatedUser);

  await reply.redirect(`${currentAppUrl}signed-in`);
}
