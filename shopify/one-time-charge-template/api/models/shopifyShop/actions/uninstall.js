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

  if (record.trialStartedAt) {
    const { usedTrialMinutes } = trialCalculations(
      record.usedTrialMinutes,
      record.trialStartedAt,
      new Date(),
      record.trialDays
    );

    record.usedTrialMinutes = usedTrialMinutes;
  }

  record.trialStartedAt = null;

  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};
