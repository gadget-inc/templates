import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
} from "gadget-server";
import { trialCalculations } from "../../../../utilities";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  transitionState(record, {
    from: ShopifyShopState.Installed,
    to: ShopifyShopState.Uninstalled,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  // Fetching the plan that the shop is associated with and retreiving the trialDays field
  const planMatch = await api.plan.maybeFindFirst({
    filter: {
      id: {
        equals: record.planId,
      },
    },
    select: {
      trialDays: true,
    },
  });

  if (planMatch) {
    // Calculates the trial minutes used
    const { usedTrialMinutes } = trialCalculations(
      record.usedTrialMinutes,
      record.trialStartedAt,
      new Date(),
      planMatch.trialDays
    );

    record.usedTrialMinutes = usedTrialMinutes;
    record.trialStartedAt = null;
  }
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Update the app subscription record to status: "CANCELLED"
  if (record.activeSubscriptionId) {
    await api.internal.shopifyAppSubscription.update(
      record.activeSubscriptionId,
      {
        status: "CANCELLED",
      }
    );
  }

  // Update the shop to clear any subscription related data
  await api.internal.shopifyShop.update(record.id, {
    activeSubscriptionId: null,
    usagePlanId: null,
    plan: null,
    billingPeriodStart: null,
    billingPeriodEnd: null,
  });
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: false },
};
