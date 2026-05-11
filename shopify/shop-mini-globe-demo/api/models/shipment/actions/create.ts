import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, session }) => {
  applyParams(params, record);

  // If a session is present, force the link to the session's buyer so a
  // session-authenticated caller can never create a shipment for someone else.
  const sessionBuyerId = session?.get("miniBuyer");
  if (sessionBuyerId) {
    record.miniBuyer = { _link: sessionBuyerId };
  }

  // Either session-derived or params-supplied: a buyer must be linked.
  if (!record.miniBuyerId) {
    logger.error({ session }, "No miniBuyer for shipment");
    throw new Error("Shipment must be linked to a buyer");
  }

  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
