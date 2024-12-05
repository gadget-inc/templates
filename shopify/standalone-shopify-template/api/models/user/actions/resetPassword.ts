// Powers form in web/routes/reset-password.jsx
import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  // Applies new 'password' to the user record and saves to database
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
  triggers: {
    resetPassword: true,
  },
};
