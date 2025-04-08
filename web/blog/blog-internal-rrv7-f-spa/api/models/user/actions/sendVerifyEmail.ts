import { applyParams, save, ActionOptions, DefaultEmailTemplates, Config } from "gadget-server";

// Powers the sign up flow, this action is called from api/models/user/actions/signUp.ts

export const run: ActionRun = async ({ params, record, logger, api, emails }) => {
  // Applies new hashed code 'emailVerificationToken' to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, emails }) => {
  if (!record.emailVerified && record.emailVerificationToken && params.user?.emailVerificationCode) {
    // Generates link to reset password
    const url = new URL("/verify-email", Config.appUrl);
    url.searchParams.append("code", params.user?.emailVerificationCode);
    // Sends link to user
    await emails.sendMail({
      to: record.email,
      subject: `Verify your email with ${Config.appName}`,
      html: DefaultEmailTemplates.renderVerifyEmailTemplate({ url: url.toString() })
    });
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  returnType: true,
  triggers: {
    sendVerificationEmail: true,
  },
};
