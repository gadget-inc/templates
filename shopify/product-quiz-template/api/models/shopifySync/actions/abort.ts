import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifySyncState,
} from "gadget-server";
import { preventCrossShopDataAccess, abortSync } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  transitionState(record, {
    from: ShopifySyncState.Running,
    to: ShopifySyncState.Errored,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await abortSync(params, record);
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
};
