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
  await api.internal.shopifyAppSubscription.update(
    record.activeSubscriptionId,
    {
      status: "CANCELLED",
    }
  );

  await api.internal.shopifyShop.update(record.id, {
    activeSubscriptionId: null,
    plan: null,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
