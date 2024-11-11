import { ActionOptions } from "gadget-server";
import { stripe } from "../stripe";

export const run: ActionRun = async ({ api, currentAppUrl, session }) => {
  if (!session) throw new Error("No session found");

  // get the Gadget userId
  const userId = session.get("user");

  const user = await api.user.findOne(userId);
  // get the Stripe customer id stored on user
  const customerId = user.stripeCustomerId;

  if (!customerId) throw new Error("No Stripe customer found");

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${currentAppUrl}signed-in?success=true&session_id={CHECKOUT_SESSION_ID}`,
  });

  return portalSession.url;
};

export const options: ActionOptions = {};
