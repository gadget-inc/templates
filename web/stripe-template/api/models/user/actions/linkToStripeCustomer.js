import {
  applyParams,
  save,
  ActionOptions,
  LinkToStripeCustomerUserActionContext,
} from "gadget-server";
import { stripe } from "../../../stripe";

/**
 * @param { LinkToStripeCustomerUserActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { LinkToStripeCustomerUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const { stripeSessionId } = params;
  // get the customerId from the stripe session
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(stripeSessionId);
  const customerId = checkoutSession.customer;

  const updatedUser = { stripeCustomerId: customerId };

  // get the subscription id and add the relation from the user model to subscription, if it exists already (subscription webhook has created the subscription)
  const subscription = await api.stripeSubscription.maybeFindFirst({
    filter: { customer: { equals: customerId } },
    select: { id: true },
  });

  if (subscription) {
    updatedUser["stripeSubscription"] = {
      update: {
        id: subscription.id,
      },
    };
  }

  await api.internal.user.update(record.id, updatedUser);
}

export const params = {
  stripeSessionId: { type: "string" },
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
