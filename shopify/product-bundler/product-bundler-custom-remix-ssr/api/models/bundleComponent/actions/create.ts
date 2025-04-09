import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);

  if (!record.quantity) record.quantity = 1;

  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
