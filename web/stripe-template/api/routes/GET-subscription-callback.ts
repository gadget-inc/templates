import { RouteContext } from "gadget-server";
import { stripe } from "../stripe";

export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}: RouteContext) {
  const { session_id, user_id } = request.query as {
    session_id: string;
    user_id: string;
  };

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  const stripeCustomerId = checkoutSession.customer as string;

  const updatedUser: {
    stripeCustomerId?: string;
    stripeSubscription?: {
      update: {
        id: string;
      };
    };
  } = { stripeCustomerId };

  const subscription = await api.stripe.subscription.maybeFindFirst({
    filter: { userId: { equals: user_id }, status: { equals: "active" } },
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

  await api.user.update(user_id, updatedUser);

  await reply.redirect(`${currentAppUrl}signed-in`);
}
