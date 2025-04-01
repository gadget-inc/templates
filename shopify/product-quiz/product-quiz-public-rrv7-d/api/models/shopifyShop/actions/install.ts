import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await api.shopifySync.run({
    domain: record.domain,
    shop: {
      _link: record.id,
    },
    models: ["shopifyProduct", "shopifyProductMedia", "shopifyFile"],
  });
};

export const options: ActionOptions = { actionType: "create" };
