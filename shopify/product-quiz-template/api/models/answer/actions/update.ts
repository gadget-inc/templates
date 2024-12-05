import {
  ActionOptions,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
