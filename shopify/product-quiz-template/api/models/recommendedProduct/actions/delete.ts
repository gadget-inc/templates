import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
