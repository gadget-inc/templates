// Powers the sign up flow, this action is called from the email generated in /actions/sendVerifyEmail.js
import { applyParams, save, ActionOptions, VerifyEmailUserActionContext } from "gadget-server";

/**
 * @param { VerifyEmailUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // Applies new 'emailVerified' status to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

/**
 * @param { VerifyEmailUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, emails }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
  triggers: {
    verifiedEmail: true
  }
};