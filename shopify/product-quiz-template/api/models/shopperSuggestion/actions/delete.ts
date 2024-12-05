import {
  deleteRecord,
  ActionOptions,
  preventCrossShopDataAccess,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
