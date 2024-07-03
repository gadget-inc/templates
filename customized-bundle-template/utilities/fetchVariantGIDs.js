import { api } from "gadget-server";

export default async (bundleId, shopId) => {
  const arr = [];

  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: {
        equals: bundleId,
      },
      shop: {
        equals: shopId,
      },
    },
    first: 250,
    select: {
      productVariantId: true,
    },
  });

  for (const bundleComponent of bundleComponents) {
    arr.push(
      `gid://shopify/ProductVariant/${bundleComponent.productVariantId}`
    );
  }

  return arr;
};
