import { UpdateBundleInShopifyGlobalActionContext } from "gadget-server";

/**
 * @param { UpdateBundleInShopifyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const {
    shopId,
    bundle: { id: bundleId, product, variant },
    productChanges,
    variantChanges,
  } = params;

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  if (productChanges?.length) {
    const { id: productId, ...productData } = product;

    // Update the product with the new data
    const productUpdateResponse = await shopify.graphql(
      `mutation ($input: ProductInput!){
        productUpdate(input: $input) {
          product {
            id
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        input: {
          id: `gid://shopify/Product/${productId}`,
          ...productData,
        },
      }
    );

    // Throw an error when the product update mutation returns userErrors
    if (productUpdateResponse?.productUpdate?.userErrors?.length)
      throw new Error(
        productUpdateResponse.productUpdate.userErrors[0].message
      );
  }

  if (variantChanges?.length) {
    const { id: variantId, ...variantData } = variant;

    // Update the product variant with the new data
    const productVariantUpdateResponse = await shopify.graphql(
      `mutation ($input: ProductVariantInput!) {
          productVariantUpdate(input: $input) {
            productVariant {
              id
            }
            userErrors {
              message
              field
            }
          }
        }`,
      {
        input: {
          id: `gid://shopify/ProductVariant/${variantId}`,
          ...variantData,
        },
      }
    );

    // Throw an error when the product variant update mutation returns userErrors
    if (productVariantUpdateResponse?.productVariantUpdate?.userErrors?.length)
      throw new Error(
        productVariantUpdateResponse.productVariantUpdate.userErrors[0].message
      );

    // Call to update quantities object
    await api.enqueue(
      api.updateBundleComponentQuantity,
      {
        bundleVariantId,
        bundleId,
        shopId,
      },
      {
        queue: {
          name: `updateBundleComponentQuantity-${shopId}`,
          maxConcurrency: 1,
        },
        retries: 1,
      }
    );
  }
}

export const params = {
  shopId: {
    type: "string",
  },
  bundle: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      bundleVariantId: {
        type: "string",
      },
      product: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          title: {
            type: "string",
          },
          status: {
            type: "string",
          },
          descriptionHtml: {
            type: "string",
          },
        },
      },
      variant: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          price: {
            type: "number",
          },
          metafields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  productChanges: {
    type: "array",
    items: {
      type: "string",
    },
  },
  variantChanges: {
    type: "array",
    items: {
      type: "string",
    },
  },
};
