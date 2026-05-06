import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, session }) => {
  // If a session is present, enforce ownership. If not (e.g. trusted server
  // call from a route that already verified auth), trust the caller.
  const sessionBuyerId = session?.get("miniBuyer");
  if (sessionBuyerId && record.miniBuyerId !== sessionBuyerId) {
    logger.error(
      { sessionBuyerId, recordBuyerId: record.miniBuyerId, recordId: record.id },
      "Cross-tenant update attempt",
    );
    throw new Error("Forbidden");
  }

  applyParams(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
};
