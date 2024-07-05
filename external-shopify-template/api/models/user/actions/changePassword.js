// Powers form in web/routes/change-password.jsx
import { applyParams, save, ActionOptions, ChangePasswordUserActionContext } from "gadget-server";

/**
 * @param { ChangePasswordUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // Applies new 'password' to the user record and saves to database
  applyParams(params, record);
  await save(record);
};

/**
 * @param { ChangePasswordUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, emails }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: {
    changePassword: true
  }
};