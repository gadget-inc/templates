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
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Create a metafield for the product to store reviews
  await api.enqueue(
    api.metadata.review.metafield.create,
    {
      shopId: record.shopId,
      productId: record.id,
    },
    {
      queue: {
        name: `queue-shop:${record.shopId}`,
        maxConcurrency: 4,
      },
    }
  );
};

export const options: ActionOptions = { actionType: "create" };
