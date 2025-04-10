import { applyParams, save, ActionOptions, DefaultEmailTemplates, Config } from "gadget-server";

// Powers the form in the the 'forgot password' page

export const run: ActionRun = async ({ params, record, logger, api, emails }) => {
  // Applies new hashed code 'resetPasswordToken' to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, emails }) => {
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

export const options: ActionOptions = {
  actionType: "custom",
  returnType: true,
  triggers: {
    sendResetPassword: true,
  },
};
