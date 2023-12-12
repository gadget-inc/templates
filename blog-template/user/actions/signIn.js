import { save, ActionOptions, SignInUserActionContext, applyParams } from "gadget-server";

/**
 * @param { SignInUserActionContext } context
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
    session?.set("user", { _link: record.id });
  }
};

/**
 * @param { SignInUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};