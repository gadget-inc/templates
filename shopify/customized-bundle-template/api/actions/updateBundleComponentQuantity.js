import { UpdateBundleComponentQuantityGlobalActionContext } from "gadget-server";

/**
 * @param { UpdateBundleComponentQuantityGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { id, quantity, productVariantId, bundleVariantId, shopId, bundleId } =
    params;

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  // Fetch all bundle components for this particular bundle
  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: {
        equals: bundleId,
      },
    },
    select: {
      id: true,
      productVariantId: true,
      quantity: true,
    },
  });

  const quantityObj = productVariantId ? { [productVariantId]: quantity } : {};

  for (const bundleComponent of bundleComponents) {
    if (id && bundleComponent.id === id) continue;

    quantityObj[bundleComponent.productVariantId] = bundleComponent.quantity;
  }

  const res = await shopify.graphql(
    `mutation ($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
        }
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
          value: JSON.stringify(quantityObj),
          type: "json",
          ownerId: `gid://shopify/ProductVariant/${bundleVariantId}`,
        },
      ],
    }
  );

  if (res?.metafieldsSet.metafields?.userErrors?.length)
    throw new Error(res.metafieldsSet.metafields.userErrors[0].message);
}

export const params = {
  id: { type: "string" },
  quantity: { type: "number" },
  productVariantId: { type: "string" },
  bundleVariantId: { type: "string" },
  bundleId: { type: "string" },
  shopId: { type: "string" },
};
