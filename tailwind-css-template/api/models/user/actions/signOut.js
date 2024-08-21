import { ActionOptions, SignOutUserActionContext } from "gadget-server";

/**
 * @param { SignOutUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // unset the associated user on the active session
  session?.set("user", null);
};

/**
 * @param { SignOutUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false, signOut: true },
};