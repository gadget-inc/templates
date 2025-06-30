import { save, ActionOptions, applyParams } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  // associate the current user record with the active session
  session?.set("user", { _link: record.id });
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: {
    api: false,
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
