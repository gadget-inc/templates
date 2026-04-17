import type { AppConnections } from "gadget-server";
import type { ProductBundlesPublicTemplateClient } from "@gadget-client/product-bundles-public-template";

type MetafieldsSetResponse = {
  metafieldsSet?: {
    userErrors?: { message: string }[];
  };
};

export const setBundleQuantitiesMetafield = async ({
  api,
  connections,
  id,
  quantity,
  productVariantId,
  bundleVariantId,
  shopId,
}: {
  api: ProductBundlesPublicTemplateClient;
  connections: AppConnections;
  id?: string | null;
  quantity?: number | null;
  productVariantId?: string | null;
  bundleVariantId: string;
  shopId: string;
}) => {
  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleVariantId: { equals: bundleVariantId },
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

  const response = await shopify.graphql<MetafieldsSetResponse>(
    `mutation SetBundleQuantities($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          message
        }
      }
    }`,
    {
      metafields: [
        {
          key: "productVariantQuantities",
          namespace: "bundle",
          value: JSON.stringify(quantityByVariantId),
          type: "json",
          ownerId: `gid://shopify/ProductVariant/${bundleVariantId}`,
        },
      ],
    }
  );

  if (response?.metafieldsSet?.userErrors?.length) {
    throw new Error(response.metafieldsSet.userErrors[0].message);
  }
};
