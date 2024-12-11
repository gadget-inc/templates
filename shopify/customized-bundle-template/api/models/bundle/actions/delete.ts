import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not established");
  if (!record.bundleVariantId) throw new Error("Bundle variant ID not found");

  // Fetch the bundle's parent product variant
  const variant = await api.shopifyProductVariant.maybeFindOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
      },
    }
  );

  if (!variant || !variant.productId)
    throw new Error("Bundle variant not found");

  // Delete the product on the Shopify store
  await shopify.product.delete(parseInt(variant.productId));

  // Fetch all the bundle components for this bundle
  let bundleComponents = await api.bundleComponent.findMany({
    first: 250,
    filter: {
      bundleId: {
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
      allBundleComponents.push(...bundleComponents);
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
};

export const options: ActionOptions = {
  actionType: "delete",
};
