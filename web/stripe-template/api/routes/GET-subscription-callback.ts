import { RouteHandler } from "gadget-server";
import { stripe } from "../stripe";

const route: RouteHandler = async ({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}) => {
  const { session_id, user_id } = request.query as {
    session_id: string;
    user_id: string;
  };

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  await api.internal.stripe.subscription.upsert({
    on: ["stripeId"],
    stripeId: checkoutSession.subscription,
    status: "active",
    user: {
      _link: user_id,
    },
  });

  await api.internal.user.update(user_id, {
    stripeCustomerId: checkoutSession.customer,
  });

  await reply.redirect(`${currentAppUrl}signed-in`);
};

export default route;
