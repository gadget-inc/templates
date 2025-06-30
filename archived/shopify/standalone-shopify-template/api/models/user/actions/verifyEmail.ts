// Powers the sign up flow, this action is called from the email generated in /actions/sendVerifyEmail.js
import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  // Applies new 'emailVerified' status to the user record and saves to database
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
    verifiedEmail: true,
  },
};
