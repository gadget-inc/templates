import { RouteContext } from "gadget-server";
import { getStripeWebhookEvent } from "../../stripe";
import { objKeyConvert, destructure } from "../../utils";

export type StripeWebhookEvent = {
  type: string;
  data: {
    object: any;
  };
};

const route = async ({
  request,
  reply,
  api,
  logger,
  connections,
}: RouteContext<{
  Body: StripeWebhookEvent;
}>) => {
  let event = request.body;

  try {
    event = getStripeWebhookEvent({
      request: request,
      endpointSecret: String(process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET),
    });
  } catch (err) {
    return await reply.status(400).send();
  }

  /**
   * Notes:
   * objKeyConvert is used to convert snake_case data coming from Stripe to camelCase. Date/time fields are converted, and stripe "id" fields are changed to "stripeId"
   * destructure is used to remove additional fields from events
   */

  let subscription;
  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });

      // if there is an active user for this customer, then add the relationship to this subscription
      const user = await api.user.maybeFindFirst({
        filter: { stripeCustomerId: { equals: subscription.customer } },
        select: { id: true },
      });

      if (user) {
        subscription.user = {
          _link: user.id,
        };
      }

      // call the stripeSubscription.create action to create a new subscription record
      try {
        await api.stripe.subscription.create(subscription);

        logger.info(
          { subscription },
          `Subscription status is ${subscription.status}.`
        );
      } catch (e) {
        logger.warn("Subscription already exists");
      }

      break;

    case "customer.subscription.updated":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });

      await api.stripe.subscription.upsert({
        on: ["stripeId"],
        ...subscription,
      });

      break;
    case "customer.subscription.deleted":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });

      const subscriptionToDelete = await api.stripe.subscription.maybeFindFirst(
        {
          filter: { stripeId: { equals: subscription.stripeId } },
          select: { id: true },
        }
      );

      if (subscriptionToDelete) {
        await api.internal.stripe.subscription.delete(subscriptionToDelete.id);
      }

      break;
    case "customer.subscription.paused":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });
      // Handle pausing a subscription
      break;
    case "customer.subscription.resumed":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });
      // Handle the resumption of a subscriptions
      break;
    case "customer.subscription.pending_update_applied":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });
      // Handle the application of pending updates
      break;
    case "customer.subscription.pending_update_expired":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });
      // Handle the expiration of pending updates
      break;
    case "customer.subscription.trial_will_end":
      subscription = destructure({
        topic: "subscription",
        obj: objKeyConvert(event.data.object),
      });
      // Handle trail ending here
      break;
    default:
      // Unexpected event type
      logger.info({ event }, `Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  await reply.send();
};

export default route;
