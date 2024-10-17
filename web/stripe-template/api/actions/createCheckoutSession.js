import {
  ActionOptions,
  CreateCheckoutSessionGlobalActionContext,
} from "gadget-server";
import { stripe } from "../stripe";

/**
 * @param { CreateCheckoutSessionGlobalActionContext } context
 * Card numbers for testing
 * Successful payment (no auth): 4242 4242 4242 4242
 * Successful payment: 4000 0025 0000 3155
 * Failed payment with insufficient funds: 4000 0000 0000 9995
 * More available at https://docs.stripe.com/testing?testing-method=card-numbers
 */
export async function run({ params, api, currentAppUrl, session, logger }) {
  const stripeSession = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: params.priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${currentAppUrl}subscription-callback?success=true&session_id={CHECKOUT_SESSION_ID}&price_id=${params.priceId}&user_id=${session.get("user")}`,
    // possibly change??
    cancel_url: `${currentAppUrl}signed-in?canceled=true`,
  });

  // return the session url back to the frontend
  return stripeSession.url;
}

export const params = {
  priceId: { type: "string" },
};

/** @type { ActionOptions } */
export const options = {};
