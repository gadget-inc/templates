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

  const stripeCustomerId = checkoutSession.customer;

  const updatedUser = { stripeCustomerId };

  const subscription = await api.stripe.subscription.maybeFindFirst({
    filter: { userId: { equals: query.user_id }, status: { equals: "active" } },
    select: { stripeId: true },
  });

  if (subscription) await stripe.subscriptions.cancel(subscription.stripeId);

  const stripeSubscription = await api.stripe.subscription.maybeFindFirst({
    filter: {
      customer: { equals: stripeCustomerId },
      status: { equals: "active" },
    },
    select: { id: true },
  });

  if (stripeSubscription) {
    updatedUser["stripeSubscription"] = {
      update: {
        id: stripeSubscription.id,
      },
    };
  }

  await api.user.update(query.user_id, updatedUser);

  await reply.redirect(`${currentAppUrl}signed-in`);
}
