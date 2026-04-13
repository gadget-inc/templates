export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { id, quantity, productVariantId, bundleVariantId, shopId, bundleId } = params;

  if (!shopId) throw new Error("Shop ID is required");
  if (!bundleVariantId) throw new Error("Bundle variant ID is required");
  if (!bundleId) throw new Error("Bundle ID is required");

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: { equals: bundleId },
      shopId: { equals: shopId },
    },
    select: {
      id: true,
      productVariantId: true,
      quantity: true,
    },
  });

  const quantityByVariantId: Record<string, number> = {};

  if (productVariantId && quantity !== undefined && quantity !== null) {
    quantityByVariantId[productVariantId] = quantity;
  }

  for (const bundleComponent of bundleComponents) {
    if (!bundleComponent.productVariantId) continue;
    if (id && bundleComponent.id === id) continue;
    quantityByVariantId[bundleComponent.productVariantId] = bundleComponent.quantity ?? 0;
  }

  const responseHandle = await api.enqueue(shopify.graphql, {
    query: `mutation SetBundleQuantities($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          message
        }
      }
    }`,
    variables: {
      metafields: [
        {
          key: "productVariantQuantities",
          namespace: "bundle",
          value: JSON.stringify(quantityByVariantId),
          type: "json",
          ownerId: `gid://shopify/ProductVariant/${bundleVariantId}`,
        },
      ],
    },
  });

  const response = (await responseHandle.result()) as {
    metafieldsSet?: {
      userErrors?: { message: string }[];
    };
  };

  if (response?.metafieldsSet?.userErrors?.length) {
    throw new Error(response.metafieldsSet.userErrors[0].message);
  }
};

export const params = {
  id: { type: "string" },
  quantity: { type: "number" },
  productVariantId: { type: "string" },
  bundleVariantId: { type: "string" },
  bundleId: { type: "string" },
  shopId: { type: "string" },
};
