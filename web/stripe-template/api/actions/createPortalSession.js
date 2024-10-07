import { ActionOptions, CreatePortalSessionGlobalActionContext } from "gadget-server";
import { stripe } from "../stripe";

/**
 * @param { CreatePortalSessionGlobalActionContext } context
 */
export async function run({ api, currentAppUrl, session }) {
  // get the Gadget userId
  const userId = session.get("user");

  const user = await api.user.findOne(userId);
  // get the Stripe customer id stored on user
  const customerId = user.stripeCustomerId;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${currentAppUrl}signed-in?success=true&session_id={CHECKOUT_SESSION_ID}`,
  });

  return portalSession.url;
};

/** @type { ActionOptions } */
export const options = {};
