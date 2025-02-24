import {
  applyParams,
  save,
  ActionOptions,
  preventCrossShopDataAccess,
} from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
