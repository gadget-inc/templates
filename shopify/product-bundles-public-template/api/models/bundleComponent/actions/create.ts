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

  if (!record.shopId) {
    const shopId =
      record.productVariantId
        ? (
            await api.shopifyProductVariant.findOne(record.productVariantId, {
              select: {
                shopId: true,
              },
            })
          ).shopId
        : record.bundleId
          ? (
              await api.bundle.findOne(record.bundleId, {
                select: {
                  shopId: true,
                },
              })
            ).shopId
          : undefined;

    if (shopId) record.shopId = shopId;
  }

  if (!record.quantity) record.quantity = 1;

  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
