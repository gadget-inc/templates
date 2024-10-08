import {
  save,
  ActionOptions,
  SignInUserActionContext,
  applyParams,
} from "gadget-server";
import { isPrimaryUser } from "../utils/userCheck";

/**
 * @param { SignInUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  applyParams(params, record);
  record.lastSignedIn = new Date();

  const isUser = await isPrimaryUser({ api, user: record });
  if (isUser) {
    await save(record);
    // associate the current user record with the active session
    session?.set("user", { _link: record.id });
  } else {
    throw new Error("User not authorized - check with app owner")
  }
}

/**
 * @param { SignInUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  triggers: {
    api: false,
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
