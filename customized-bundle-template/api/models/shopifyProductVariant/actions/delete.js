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
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (record.isBundle) {
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
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: false },
};
