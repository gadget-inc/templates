import { save, ActionOptions, applyParams } from "gadget-server";
import { isPrimaryUser } from "../utils/userCheck";
import { GadgetRecord, User } from "@gadget-client/blog-template";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  session,
}) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();

  const isUser = await isPrimaryUser(record as GadgetRecord<User>);

  if (isUser) {
    await save(record);
    // associate the current user record with the active session
    session?.set("user", { _link: record.id });
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
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "custom",
  triggers: {
    api: false,
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
