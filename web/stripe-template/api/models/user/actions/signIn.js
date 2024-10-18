import { save, ActionOptions, SignInUserActionContext, applyParams } from "gadget-server";

/**
 * @param { SignInUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  // associate the current user record with the active session
  session?.set("user", { _link: record.id });
};

/**
 * @param { SignInUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: {
    googleOAuthSignIn: true,
    emailSignIn: true
  }
};