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

  // Set a lowercase version of the title for easier searching in the frontend
  record.titleLowercase = record.title.toLowerCase();

  await save(record);
}

/**
 * @param { CreateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Enqueue the global action that creates the bundle
  await api.enqueue(
    api.createBundleInShopify,
    {
      shopId: record.shopId,
      bundle: {
        id: record.id,
        product: {
          title: record.title,
          status: record.status,
        },
        variant: {
          price: record.price,
          description: record.description,
        },
      },
    },
    {
      queue: {
        name: `createBundleInShopify-${record.shopId}`,
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
