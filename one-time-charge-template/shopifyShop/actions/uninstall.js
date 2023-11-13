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

  const { usedTrialMinutes } = trialCalculations(
    record.usedTrialMinutes,
    record.trialStarted,
    new Date(),
    record.trialDays
  );

  record.usedTrialMinutes = usedTrialMinutes;
  record.trialStarted = null;

  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Needs to be changed to one time shape
  await api.internal.shopifyAppSubscription.update(
    record.activeRecurringSubscriptionId,
    {
      status: "CANCELLED",
    }
  );

  await api.internal.shopifyShop.update(record.id, {
    activeRecurringSubscriptionId: null,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
