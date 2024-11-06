import { deleteRecord, ActionOptions } from "gadget-server";

/**
 * @param { DeletePlanActionContext } context
 */
export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
