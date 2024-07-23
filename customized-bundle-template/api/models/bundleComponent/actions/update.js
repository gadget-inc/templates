import {
  applyParams,
  save,
  ActionOptions,
  UpdateBundleComponentActionContext,
} from "gadget-server";

/**
 * @param { UpdateBundleComponentActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { UpdateBundleComponentActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (record.changed("quantity")) {
    const bundle = await api.bundle.findOne(record.bundleId, {
      select: {
        bundleVariant: {
          id: true,
        },
      },
    });

    await api.enqueue(
      api.updateBundleComponentQuantity,
      {
        id: record.id,
        quantity: record.quantity,
        productVariantId: record.productVariantId,
        bundleVariantId: bundle.bundleVariant.id,
        bundleId: record.bundleId,
        shopId: record.shopId,
      },
      {
        queue: {
          name: `updateBundleComponentQuantity-${record.shopId}`,
          maxConcurrency: 1,
        },
        retries: 1,
      }
    );
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
