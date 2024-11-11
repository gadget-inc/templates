import { applyParams, save, ActionOptions } from "gadget-server";
import { checkForSingleUser } from "../utils/userCheck";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();

  // This assures that there will only be one user able to log in to create posts
  const doesUserExist = await checkForSingleUser();
  if (!doesUserExist) {
    await save(record);
    // associate the current user record with the active session
    if (record.emailVerified) {
      session?.set("user", { _link: record.id });
    }
    return {
      result: "ok",
    };
  } else {
    throw new Error("User not authorized - check with app owner");
  }
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {
  // sends the user a verification email if they have not yet verified
  if (!record.emailVerified) {
    await api.user.sendVerifyEmail({ email: record.email });
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    api: false,
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
