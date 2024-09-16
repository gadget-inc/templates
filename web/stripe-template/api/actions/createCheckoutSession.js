import { ActionOptions, CreateCheckoutSessionGlobalActionContext } from "gadget-server";
import { stripe } from "../stripe";

/**
 * @param { CreateCheckoutSessionGlobalActionContext } context
 */
export async function run({ params, api, currentAppUrl }) {
  const price = await api.price.findFirst({ filter: { lookupKey: { equals: params.lookupKey } }, select: { stripeId: true } });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: price.stripeId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${currentAppUrl}signed-in?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${currentAppUrl}signed-in?canceled=true`,
  });

  // return the session url back to the frontend
  return session.url;
};

export const params = {
  lookupKey: { type: "string" },
};

/** @type { ActionOptions } */
export const options = {};
