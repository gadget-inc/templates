// Powers form in web/routes/forgot-password.jsx
import { applyParams, save, ActionOptions, SendResetPasswordUserActionContext, DefaultEmailTemplates, Config } from "gadget-server";

/**
 * @param { SendResetPasswordUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // Applies new hashed code 'resetPasswordToken' to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

/**
 * @param { SendResetPasswordUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, emails }) {
  if (record.resetPasswordToken && params.user?.resetPasswordCode) {
    // Generates link to reset password
    const url = new URL("/reset-password", Config.appUrl);
    url.searchParams.append("code", params.user?.resetPasswordCode);
    // Sends link to user
    await emails.sendMail({
      to: record.email,
      subject: `Reset password request from ${Config.appName}`,
      html: DefaultEmailTemplates.renderResetPasswordTemplate({ url: url.toString() })
    })
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
  triggers: {
    sendResetPassword: true
  }
};