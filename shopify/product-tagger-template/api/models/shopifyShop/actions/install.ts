import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
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
  triggers: { api: false },
};
