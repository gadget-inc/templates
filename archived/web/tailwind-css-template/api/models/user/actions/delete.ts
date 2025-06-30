import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await deleteRecord(record);
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
  actionType: "delete",
  triggers: { api: true },
};
