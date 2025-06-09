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

  // Creating a slug from the title field using the generateSlug utility
  record.slug = generateSlug(record.title);

  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
