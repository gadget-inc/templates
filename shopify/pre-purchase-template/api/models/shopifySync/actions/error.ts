import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  transitionState,
  ActionOptions,
  ShopifySyncState,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  transitionState(record, {
    from: ShopifySyncState.Running,
    to: ShopifySyncState.Errored,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
