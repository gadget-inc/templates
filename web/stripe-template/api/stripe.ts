import Stripe from "stripe";
import { logger, RouteContext } from "gadget-server";
import { StripeWebhookEvent } from "./routes/webhook/POST-subscription";

export const stripe = new Stripe(String(process.env.STRIPE_API_KEY));

export function getStripeWebhookEvent({
  request,
  endpointSecret,
}: {
  request: RouteContext["request"];
  endpointSecret: string;
}) {
  let event = request.body as StripeWebhookEvent;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];

    logger.info(
      { signature, signatureType: typeof signature },
      "Stripe signature"
    );

    try {
      event = stripe.webhooks.constructEvent(
        String(request.body),
        String(signature),
        endpointSecret
      );
    } catch (err) {
      logger.error({ err }, "⚠️  Webhook signature verification failed.");
      throw err;
    }
  }

  return event;
}
