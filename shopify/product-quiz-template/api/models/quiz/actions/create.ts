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
  return (
    input
      // Convert to lowercase
      .toLowerCase()
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Remove all non-word characters
      .replace(/[^\w-]+/g, "")
      // Replace multiple hyphens with a single hyphen
      .replace(/--+/g, "-")
      // Trim hyphens from start and end of the string
      .replace(/^-+|-+$/g, "")
  );
}

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
