import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
};
