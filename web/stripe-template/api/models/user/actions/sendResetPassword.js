import { applyParams, save, ActionOptions, SendResetPasswordUserActionContext, DefaultEmailTemplates, Config } from "gadget-server";

/**
 * @param { SendResetPasswordUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
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
    const url = new URL("/reset-password", Config.appUrl);
    url.searchParams.append("code", params.user?.resetPasswordCode);
    // sends a reset password email with a link generated internally by Gadget
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