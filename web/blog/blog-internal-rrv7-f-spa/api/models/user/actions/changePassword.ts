import { applyParams, save, ActionOptions } from "gadget-server";

// Powers the form in the 'change password' page

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  // Applies new 'password' to the user record and saves to database
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: {
    changePassword: true,
  },
};
