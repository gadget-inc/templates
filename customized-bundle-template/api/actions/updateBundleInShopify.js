import { UpdateBundleInShopifyGlobalActionContext } from "gadget-server";

/**
 * @param { UpdateBundleInShopifyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  logger.info({ params }, "PARAMS");

  const {
    shopId,
    bundle: { id, product, variant },
    productChanges,
    variantChanges,
  } = params;

  const shopify = await connections.shopify.forShopId(shopId);

  if (productChanges?.length) {
    const { id: productId, ...productData } = product;

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

    if (productUpdateResponse?.productUpdate?.userErrors?.length)
      throw new Error(
        productUpdateResponse.productUpdate.userErrors[0].message
      );
  }

  if (variantChanges?.length) {
    const { id: variantId, ...variantData } = variant;

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

    if (productVariantUpdateResponse?.productVariantUpdate?.userErrors?.length)
      throw new Error(
        productVariantUpdateResponse.productVariantUpdate.userErrors[0].message
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
          requiresComponents: {
            type: "boolean",
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
