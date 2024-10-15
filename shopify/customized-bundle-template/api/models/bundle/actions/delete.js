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

  // Fetch the bundle's parent product variant
  const variant = await api.shopifyProductVariant.maybeFindOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
      },
    }
  );

  if (!variant) throw new Error("Bundle variant not found");

  // Delete the product on the Shopify store
  await shopify.product.delete(variant.productId);

  // Fetch all the bundle components for this bundle
  let bundleComponents = await api.bundleComponent.findMany({
    first: 250,
    filterId: {
      bundle: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (bundleComponents.length) {
    // If there are bundle components, check if there are more than 250
    let allBundleComponents = bundleComponents;

    while (bundleComponents.hasNextPage) {
      bundleComponents = await bundleComponents.nextPage();
      allBundleComponents = allBundleComponents.concat(bundleComponents);
    }

    // Create an array of ids
    const ids = allBundleComponents.map((bc) => bc.id);

    // Delete all of this bundle's components
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
