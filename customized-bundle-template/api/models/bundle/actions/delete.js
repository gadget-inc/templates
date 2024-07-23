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

  if (!variant) throw new Error("Bundle variant not found");

  await shopify.product.delete(variant.productId);

  let bundleComponents = await api.bundleComponent.findMany({
    first: 250,
    filter: {
      bundle: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (bundleComponents.length) {
    let allBundleComponents = bundleComponents;

    while (bundleComponents.hasNextPage) {
      bundleComponents = await bundleComponents.nextPage();
      allBundleComponents = allBundleComponents.concat(bundleComponents);
    }

    const ids = allBundleComponents.map((bc) => bc.id);

    await api.internal.bundleComponent.deleteMany({
      filter: {
        id: {
          in: ids,
        },
      },
    });
  }

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
