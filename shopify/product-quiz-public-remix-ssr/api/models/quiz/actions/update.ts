import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { generateSlug } from "../utils";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  //  Check if the title has changed
  if (record.changed("title")) {
    // Updating the slug field using the title field, with the generateSlug utility
    record.slug = generateSlug(record.title);
  }

  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
};
