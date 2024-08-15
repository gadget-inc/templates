import {
  applyParams,
  save,
  ActionOptions,
  CreateQuizActionContext,
} from "gadget-server";

/**
 * @param { CreateQuizActionContext } context
 */
export async function run({ params, record, connections, logger, api }) {
  applyParams(params, record);

  record.slug = generateSlug(record.title);
  record.shop = { _link: connections.shopify.currentShopId };

  await save(record);
}

function generateSlug(input) {
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

/**
 * @param { CreateQuizActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
