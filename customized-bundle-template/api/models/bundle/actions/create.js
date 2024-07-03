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
  const shopId = connections.shopify.currentShopId.toString();

  await api.enqueue(
    api.createBundleInShopify,
    {
      shopId,
      bundle: {
        id: record.id,
        product: {
          title: record.title,
          status: record.status,
        },
        variant: {
          price: record.price,
          requiresComponents: record.requiresComponents,
          description: record.description,
        },
      },
    },
    {
      queue: {
        name: `createBundleInShopify-${shopId}`,
        maxConcurrency: 2,
      },
      retries: 1,
    }
  );
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
