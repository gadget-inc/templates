// Powers the form in web/routes/sign-up.jsx
import { applyParams, save, ActionOptions, SignUpUserActionContext } from "gadget-server";

/**
 * @param { SignUpUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // Applies new 'email' and 'password' to the user record and saves to database
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  if (record.emailVerified) {
    // Assigns the signed-in user to the active session
    session?.set("user", { _link: record.id });
  }
  return {
    result: "ok"
  }
};

/**
 * @param { SignUpUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  if (!record.emailVerified) {
    // Sends verification email by calling api/models/users/actions/sendVerifyEmail.js
    await api.user.sendVerifyEmail({ email: record.email });
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  returnType: true,
  triggers: {
    googleOAuthSignUp: true,
    emailSignUp: true
  }
};