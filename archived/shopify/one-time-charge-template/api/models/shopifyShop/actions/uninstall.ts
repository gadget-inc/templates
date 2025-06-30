import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
} from "gadget-server";
import { trialCalculations } from "../helpers";

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
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: false },
};
