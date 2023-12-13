import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
} from "gadget-server";
import { trialCalculations } from "../../utilities";

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {
    from: ShopifyShopState.Installed,
    to: ShopifyShopState.Uninstalled,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  // Fetching the plan that the shop is associated with and retreiving the trialDays field
  const planMatch = await api.plan.maybeFindOne(record.planId, {
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
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Update the app subscription record to status: "CANCELLED"
  await api.internal.shopifyAppSubscription.update(
    record.activeSubscriptionId,
    {
      status: "CANCELLED",
    }
  );

  // Update the shop to clear any subscription related data
  await api.internal.shopifyShop.update(record.id, {
    activeSubscriptionId: null,
    usagePlanId: null,
    plan: null,
    billingPeriodStart: null,
    billingPeriodEnd: null,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
