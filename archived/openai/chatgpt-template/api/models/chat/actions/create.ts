import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
  session,
}) => {
  applyParams(params, record);

  if (!record.userId) {
    // @ts-ignore
    record.user = {
      _link: session?.get("user"),
    };
  }

  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
