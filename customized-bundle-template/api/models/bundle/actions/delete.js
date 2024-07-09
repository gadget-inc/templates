import {
  deleteRecord,
  ActionOptions,
  DeleteBundleActionContext,
} from "gadget-server";

/**
 * @param { DeleteBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  const shopify = connections.shopify.current;

  const variant = await api.shopifyProductVariant.maybeFindOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
      },
    }
  );

  if (!variant) throw new Error("Bundle variant not found")

  await shopify.product.delete(variant.productId);

  await deleteRecord(record);
}

/**
 * @param { DeleteBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
