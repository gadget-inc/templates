import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  record.titleLowercase = record.title.toLowerCase();

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Enqueue the global action that creates the bundle
  await api.enqueue(
    api.createBundleInShopify,
    {
      shopId: String(connections.shopify.currentShop?.id),
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
        maxConcurrency: 4,
      },
      retries: 1,
    }
  );
};

export const options: ActionOptions = {
  actionType: "create",
};
