import {
  applyParams,
  save,
  transitionState,
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
  await api.shopifySync.run({
    domain: record.domain,
    shop: {
      _link: record.id,
    },
    models: ["shopifyProduct"],
  });
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: false },
};
