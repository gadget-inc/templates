import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  emails,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
