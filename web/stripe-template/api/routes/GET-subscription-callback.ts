import { RouteContext } from "gadget-server";
import { stripe } from "../stripe";

const route = async ({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}: RouteContext<{
  Querystring: {
    session_id: string;
    user_id: string;
  };
}>) => {
  const { session_id, user_id } = request.query;

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  const stripeCustomerId = checkoutSession.customer;

  const updatedUser: {
    stripeCustomerId: string | null | undefined;
    stripeSubscription?: {
      update: {
        id: string;
      };
    };
  } = {
    stripeCustomerId:
      typeof stripeCustomerId === "string" ? stripeCustomerId : null,
  };

  const subscription = await api.stripe.subscription.maybeFindFirst({
    filter: { userId: { equals: user_id }, status: { equals: "active" } },
    select: { stripeId: true },
  });

  if (subscription) await stripe.subscriptions.cancel(subscription.stripeId);

  const stripeSubscription = await api.stripe.subscription.maybeFindFirst({
    filter: {
      customer: { equals: stripeCustomerId as string | undefined },
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
};

export default route;
