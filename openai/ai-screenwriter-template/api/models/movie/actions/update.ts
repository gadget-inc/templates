import { ActionOptions, applyParams, save } from "gadget-server";

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

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
