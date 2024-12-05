import {
  applyParams,
  save,
  ActionOptions,
  preventCrossShopDataAccess,
} from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  connections,
  logger,
  api,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  record.slug = generateSlug(record.title);

  await save(record);
};

function generateSlug(input: string) {
  /**
   * 1. Convert input to lowercase
   * 2. Replace spaces with hyphens
   * 3. Remove all non-word characters
   * 4. Replace multiple hyphens with a single hyphen
   * 5. Trim hyphens from start and end of the string
   */
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
