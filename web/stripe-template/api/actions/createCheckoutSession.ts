import { ActionOptions } from "gadget-server";
import { stripe } from "../stripe";

/**
 * Card numbers for testing
 * Successful payment (no auth): 4242 4242 4242 4242
 * Successful payment: 4000 0025 0000 3155
 * Failed payment with insufficient funds: 4000 0000 0000 9995
 * More available at https://docs.stripe.com/testing?testing-method=card-numbers
 */
export const run: ActionRun = async ({
  params,
  api,
  currentAppUrl,
  session,
  logger,
}) => {
  if (!session) throw new Error("No session found");

  const userId: string = session.get("user");

  if (!userId) throw new Error("No userId found");

  const user = await api.user.findOne(userId, {
    select: {
      stripeCustomerId: true,
    },
  });

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
    success_url: `${currentAppUrl}subscription-callback?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
    cancel_url: `${currentAppUrl}signed-in?canceled=true`,
    customer: user?.stripeCustomerId ?? undefined,
  });

  // return the session url back to the frontend
  return stripeSession.url;
};

export const params = {
  priceId: { type: "string" },
};

export const options: ActionOptions = {};
