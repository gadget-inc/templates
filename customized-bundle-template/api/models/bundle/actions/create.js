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
  // Might need to change the logic to use the new productBundleCreate mutation from 24-07
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
