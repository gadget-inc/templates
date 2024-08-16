import {
  applyParams,
  save,
  ActionOptions,
  CreateRecommendedProductActionContext,
} from "gadget-server";

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function run({ params, record, connections, logger, api }) {
  applyParams(params, record);

  record.shop = { _link: connections.shopify.currentShopId };

  await save(record);
}

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
