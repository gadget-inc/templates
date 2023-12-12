import { applyParams, save, ActionOptions, SignUpUserActionContext } from "gadget-server";

/**
 * @param { SignUpUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  applyParams(params, record);
  record.lastSignedIn = new Date();

  /**
   * AUTHOR_EMAIL is a "whitelist" of users who can sign in and write blog posts
   * Currently uses an environment variable to store a single email
   * Could also be stored in a model
   */
  if (record.email === process.env.AUTHOR_EMAIL) {
    await save(record);
    // associate the current user record with the active session
    if (record.emailVerified) {
      session?.set("user", { _link: record.id });
    }
    return {
      result: "ok"
    }
  }
};

/**
 * @param { SignUpUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // sends the user a verification email if they have not yet verified
  if (!record.emailVerified) {
    await api.user.sendVerifyEmail({ email: record.email });
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  returnType: true
};