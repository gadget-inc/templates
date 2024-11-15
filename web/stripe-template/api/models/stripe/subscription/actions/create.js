import {
  applyParams,
  save,
  ActionOptions,
  CreateStripeSubscriptionActionContext,
} from "gadget-server";

/**
 * @param { CreateStripeSubscriptionActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateStripeSubscriptionActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Move this to the subscription creation topic handler
  const user = await api.user.maybeFindFirst({
    filter: { stripeCustomerId: { equals: record.customer } },
    select: { id: true },
  });
  if (user) {
    record.user = {
      _link: user.id,
    };
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
