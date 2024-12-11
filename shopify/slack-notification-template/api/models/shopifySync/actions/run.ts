import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  shopifySync,
  ActionOptions,
  ShopifySyncState,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  transitionState(record, { to: ShopifySyncState.Running });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
  await shopifySync(params, record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
