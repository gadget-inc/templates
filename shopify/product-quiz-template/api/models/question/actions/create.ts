import {
  applyParams,
  save,
  ActionOptions,
  preventCrossShopDataAccess,
} from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  connections,
  logger,
  api,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
