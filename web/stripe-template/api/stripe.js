import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY);

export function getStripeWebhookEvent({ logger, request, endpointSecret }) {
  let event = request.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];

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
