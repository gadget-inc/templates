import { RouteContext } from "gadget-server";

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

  logger.info({ query }, "subscription-callback");

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    query.session_id
  );

  // logger.info({ checkoutSession }, "checkoutSession");

  const customerId = checkoutSession.customer;

  const updatedUser = { stripeCustomerId: customerId };

  // This needs to be changed to account for other active subscriptions. Will need to deactivate other subscriptions
  const subscription = await api.stripe.subscription.maybeFindFirst({
    filter: { customer: { equals: customerId } },
    select: { id: true },
  });

  if (subscription) {
    updatedUser["stripeSubscription"] = {
      update: {
        id: subscription.id,
      },
    };
  }

  await api.user.update(record.id, updatedUser);

  // update the subscription using the internal api

  // link to a product so that we can disable the current plan selection button

  await reply.redirect(`${currentAppUrl}signed-in`);
}
