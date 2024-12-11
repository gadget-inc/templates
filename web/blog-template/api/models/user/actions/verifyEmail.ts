import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  applyParams(params, record);
  await save(record);
  return {
    result: "ok",
  };
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
  actionType: "custom",
  returnType: true,
  triggers: { api: false, verifiedEmail: true },
};
