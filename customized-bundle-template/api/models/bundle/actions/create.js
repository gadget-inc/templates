import {
  applyParams,
  save,
  ActionOptions,
  CreateBundleActionContext,
} from "gadget-server";

/**
 * @param { CreateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  record.titleLowercase = record.title.toLowerCase();

  await save(record);
}

/**
 * @param { CreateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  logger.info({ record }, "onSuccess");

  await api.enqueue(
    api.createBundleInShopify,
    {
      shopId: connections.shopify.currentShopId.toString(),
      bundle: {
        id: record.id,
        title: record.title,
        status: record.status,
        price: record.price,
        requiresComponents: record.requiresComponents,
        description: record.description,
      },
    },
    {
      queue: {
        name: "createBundleInShopify",
        maxConcurrency: 1,
      },
      retries: 1,
    }
  );
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
