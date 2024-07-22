// Powers the sign up flow, this action is called from api/models/user/actions/signUp.js
import { applyParams, save, ActionOptions, SendVerifyEmailUserActionContext, DefaultEmailTemplates, Config } from "gadget-server";

/**
 * @param { SendVerifyEmailUserActionContext } context
 */
export async function run({ params, record, logger, api, session }) {
  // Applies new hashed code 'emailVerificationToken' to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

/**
 * @param { SendVerifyEmailUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, emails }) {
  if (!record.emailVerified && record.emailVerificationToken && params.user?.emailVerificationCode) {
    // Generates link to reset password
    const url = new URL("/verify-email", Config.appUrl);
    url.searchParams.append("code", params.user?.emailVerificationCode);
    // Sends link to user
    await emails.sendMail({
      to: record.email,
      subject: `Verify your email with ${Config.appName}`,
      html: DefaultEmailTemplates.renderVerifyEmailTemplate({ url: url.toString() })
    })
  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
  triggers: {
    sendVerificationEmail: true
  }
};