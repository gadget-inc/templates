import { ActionOptions } from "gadget-server";
import { stripe } from "../stripe";
import Stripe from "stripe";

export const run: ActionRun = async ({ api, currentAppUrl, session }) => {
  if (!session) throw new Error("No session found");

  // get the Gadget userId
  const userId = session.get("user");

  const user = await api.user.findOne(userId);
  // get the Stripe customer id stored on user
  const customerId = user.stripeCustomerId;

  if (!customerId) throw new Error("No Stripe customer found");

  let settings = await api.stripe.settings.maybeFindFirst({
    select: {
      billingPortalConfigId: true,
    },
  });

  // Modify this configuration object if you want different customer portal settings
  const configuration: Stripe.BillingPortal.ConfigurationCreateParams = {
    business_profile: {
      headline: "template.dev",
    },
    features: {
      customer_update: {
        allowed_updates: ["email", "tax_id"],
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
      payment_method_update: {
        enabled: true,
      },
      subscription_cancel: {
        cancellation_reason: {
          enabled: false,
          options: [
            "too_expensive",
            "missing_features",
            "switched_service",
            "unused",
            "other",
          ],
        },
        enabled: true,
        mode: "immediately",
        proration_behavior: "create_prorations",
      },
    },
  };

  if (
    process.env.NODE_ENV === "development" &&
    settings?.billingPortalConfigId
  ) {
    await stripe.billingPortal.configurations.update(
      settings.billingPortalConfigId,
      configuration
    );
  }

  if (!settings?.billingPortalConfigId) {
    const stripeBillingPortalSetting =
      await stripe.billingPortal.configurations.create(configuration);

    settings = await api.stripe.settings.create({
      billingPortalConfigId: stripeBillingPortalSetting.id,
    });
  }

  if (!settings.billingPortalConfigId)
    throw new Error("No billing portal configuration found");

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${currentAppUrl}signed-in`,
    configuration: settings.billingPortalConfigId,
  });

  return portalSession.url;
};

export const options: ActionOptions = {};
