import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  api,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (!record.shopId) {
    const lookupVariantId = record.productVariantId ?? record.bundleVariantId;
    if (lookupVariantId) {
      const variant = await api.shopifyProductVariant.findOne(lookupVariantId, {
        select: { shopId: true },
      });
      if (variant.shopId) record.shopId = variant.shopId;
    }
  }

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  record,
  api,
  connections,
}) => {
  if (record.changed("quantity") && record.bundleVariantId) {
    const shopId = String(connections.shopify.currentShop?.id ?? record.shopId ?? "");

    await api.syncBundleComponentQuantities({
      id: record.id,
      quantity: record.quantity,
      productVariantId: record.productVariantId,
      bundleVariantId: record.bundleVariantId,
      shopId,
    });
  }
};

export const options: ActionOptions = {
  actionType: "update",
};
