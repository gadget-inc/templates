import { applyParams, save, ActionOptions } from "gadget-server";

/**
 * @param { UpdateChatActionContext } context
 */
export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
