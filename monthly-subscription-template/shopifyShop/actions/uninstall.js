import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
} from "gadget-server";
import { trialCalculations } from "../helpers";

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

  const planMatch = await api.plan.maybeFindOne(record.planId, {
    select: {
      trialDays: true,
    },
  });

  if (planMatch) {
    // Calculating the usedTrialMinutes value so that any subsequent install and plan selection can have a more accurate number of trial days set
    const { usedTrialMinutes } = trialCalculations(
      record.usedTrialMinutes,
      record.usedTrialMinutesUpdatedAt,
      new Date(),
      planMatch.trialDays
    );

    record.usedTrialMinutes = usedTrialMinutes;
    record.usedTrialMinutesUpdatedAt = null;
  }

  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.internal.shopifyAppSubscription.update(
    record.activeRecurringSubscriptionId,
    {
      status: "CANCELLED",
    }
  );

  await api.internal.shopifyShop.update(record.id, {
    activeRecurringSubscriptionId: null,
    plan: null,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
