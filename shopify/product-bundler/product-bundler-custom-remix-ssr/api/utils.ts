import { api } from "gadget-server";

export const fetchVariantGIDs = async (
  bundleId: string,
): Promise<string[]> => {
  const arr: string[] = [];

  // Fetch all bundle components related to the bundle (will need to paginate if there is ever more than 250)
  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: {
        equals: bundleId,
      },
    },
    first: 250,
    select: {
      productVariantId: true,
    },
  });

  // Loop through the bundle components and push the GID of each product variant to the array
  for (const bundleComponent of bundleComponents) {
    arr.push(
      `gid://shopify/ProductVariant/${bundleComponent.productVariantId}`
    );
  }

  return arr;
};
