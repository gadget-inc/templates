import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ record, logger, session }) => {
  const sessionBuyerId = session?.get("miniBuyer");
  if (sessionBuyerId && record.miniBuyerId !== sessionBuyerId) {
    logger.error(
      { sessionBuyerId, recordBuyerId: record.miniBuyerId, recordId: record.id },
      "Cross-tenant delete attempt",
    );
    throw new Error("Forbidden");
  }

  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
};
