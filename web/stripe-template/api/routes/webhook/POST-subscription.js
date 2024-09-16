import { RouteContext } from "gadget-server";
import { getStripeWebhookEvent } from "../../stripe";
import { subscriptionDestructure, objKeyConvert } from "../../utils/caseConvert";

/**
 * Route handler for POST webhook/subscription
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  let event = request.body;

  try {
    event = getStripeWebhookEvent({ logger, request: request, endpointSecret: process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET })
  } catch (err) {
    return await reply.status(400).send();
  }

  /**
   * Notes: objKeyConvert is used to convert snake_case data coming from Stripe to camelCase. Date/time fields are converted, and stripe "id" fields are changed to "stripeId"
   *        subscriptionDestructure strips out subscription fields that are not defined in this app - if you need additional fields, add them to your model and the subscriptionDestructure list!
   */

  let subscription;
  let status;
  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      subscription = subscriptionDestructure(objKeyConvert(event.data.object));

      // if there is an active user for this customer, then add the relationship to this subscription
      const user = await api.user.maybeFindFirst({ filter: { stripeCustomerId: { equals: subscription.customer } }, select: { id: true } })
      if (user) {
        subscription.user = {
          _link: user.id
        }
      }

      // call the stripeSubscription.create action to create a new subscription record
      await api.stripeSubscription.create(subscription);

      status = subscription.status;
      logger.info({ subscription }, `Subscription status is ${status}.`);
      break;

    case 'customer.subscription.updated':
      subscription = subscriptionDestructure(objKeyConvert(event.data.object));
      // get the Gadget id of the subscription
      const subscriptionToUpdate = await api.stripeSubscription.maybeFindFirst({ filter: { stripeId: { equals: subscription.id } }, select: { id: true } });
      if (subscriptionToUpdate) {
        // call the stripeSubscription.update action to update the subscription record
        await api.stripeSubscription.update(subscriptionToUpdate.id, subscription);

        status = subscription.status;
        logger.info({ subscription }, `Subscription status is ${status}.`);
      } else {
        logger.info({ subscription }, "Stripe subscription not found, no record updated");
      }
      break;
    case 'customer.subscription.deleted':
      subscription = objKeyConvert(event.data.object);
      // Handle deleting a subscription
      break;
    case 'customer.subscription.paused':
      subscription = objKeyConvert(event.data.object);
      // Handle pausing a subscription
      break;
    case 'customer.subscription.resumed':
      subscription = objKeyConvert(event.data.object);
      // Handle the resumption of a subscriptions
      break;
    case 'customer.subscription.pending_update_applied':
      subscription = objKeyConvert(event.data.object);
      // Handle the application of pending updates
      break;
    case 'customer.subscription.pending_update_expired':
      subscription = objKeyConvert(event.data.object);
      // Handle the expiration of pending updates
      break;
    case 'customer.subscription.trial_will_end':
      subscription = objKeyConvert(event.data.object);
      // Handle trail ending here
      break;
    default:
      // Unexpected event type
      logger.info({ event }, `Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  await reply.send();
}
