import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductVariantActionContext,
} from "gadget-server";

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 * This function has similar logic to the onSuccess function in the bundle delete action. This handles the case that a merchant deletes a bundle from the admin (products page).
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (record.isBundle) {
    // If the product variant is a bundle, delete the bundle and its components
    const bundle = await api.bundle.maybeFindFirst({
      filter: {
        bundleVariant: {
          equals: record.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (bundle) {
      await api.internal.bundle.delete(bundle.id);
    }
  }

  // Find all bundle components related to this product variant
  let bundleComponents = await api.bundleComponent.findMany({
    first: 250,
    filter: {
      productVariant: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (bundleComponents.length) {
    // Fetch more bundle components if there are more than 250
    let allBundleComponents = bundleComponents;

    while (bundleComponents.hasNextPage) {
      bundleComponents = await bundleComponents.nextPage();
      allBundleComponents = allBundleComponents.concat(bundleComponents);
    }

    // Create an array of bundle component IDs
    const ids = allBundleComponents.map((bc) => bc.id);

    // Delete all bundle components associated with this product variant
    await api.internal.bundleComponent.deleteMany({
      filter: {
        id: {
          in: ids,
        },
      },
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: false },
};
