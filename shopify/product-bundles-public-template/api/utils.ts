import { api } from "gadget-server";

export const fetchVariantGIDs = async (bundleId: string, shopId: string) => {
  const bundleComponents = await api.bundleComponent.findMany({
    first: 250,
    filter: {
      bundleId: { equals: bundleId },
      shopId: { equals: shopId },
    },
    select: {
      productVariantId: true,
    },
  });

  return bundleComponents
    .map((bundleComponent) => bundleComponent.productVariantId)
    .filter((productVariantId): productVariantId is string => Boolean(productVariantId))
    .map((productVariantId) => `gid://shopify/ProductVariant/${productVariantId}`);
};
