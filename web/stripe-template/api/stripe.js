import Stripe from "stripe";
import { logger } from "gadget-server";

export const stripe = new Stripe(process.env.STRIPE_API_KEY);

export function getStripeWebhookEvent({ request, endpointSecret }) {
  let event = request.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      logger.error({ err }, "⚠️  Webhook signature verification failed.");
      throw err;
    }
  }

  return event;
}
