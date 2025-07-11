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
  // Check if the quantity has changed
  if (record.changed("quantity") && record.bundleId) {
    // Fetch the parent bundle
    const bundle = await api.bundle.findOne(record.bundleId, {
      select: {
        bundleVariant: {
          id: true,
        },
      },
    });

    // Enqueue the global action that updates the bundle component quantity metafield in Shopify
    await api.enqueue(
      api.updateBundleComponentQuantity,
      {
        id: record.id,
        quantity: record.quantity,
        productVariantId: record.productVariantId,
        bundleVariantId: bundle.bundleVariant?.id,
        bundleId: record.bundleId,
        shopId: String(connections.shopify.currentShop?.id),
      },
      {
        queue: {
          name: `updateBundleComponentQuantity-${String(connections.shopify.currentShop?.id)}`,
          maxConcurrency: 4,
        },
        retries: 1,
      }
    );
  }
};

export const options: ActionOptions = {
  actionType: "update",
};
