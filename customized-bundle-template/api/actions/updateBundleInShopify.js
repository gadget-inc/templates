import { UpdateBundleInShopifyGlobalActionContext } from "gadget-server";

/**
 * @param { UpdateBundleInShopifyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const {
    shopId,
    bundle: { id, product, variant },
    productChanges,
    variantChanges,
  } = params;

  const shopify = await connections.shopify.forShopId(shopId);

  if (productChanges.length) {
    const input = {
      id: `gid://shopify/Product/${product.id}`,
    };

    for (const change of productChanges) {
      switch (change) {
        case "title":
          input.title = product.title;
          break;
        case "status":
          input.status = product.status.toUpperCase();
          break;
        default:
          break;
      }
    }

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
      { input }
    );

    if (productUpdateResponse?.productUpdate?.userErrors?.length)
      throw new Error(
        productUpdateResponse.productUpdate.userErrors[0].message
      );
  }

  if (variantChanges.length) {
    const input = {
      id: `gid://shopify/ProductVariant/${variant.id}`,
    };

    for (const change of variantChanges) {
      switch (change) {
        case "price":
          input.price = variant.price;
          break;
        case "requiresComponents":
          input.requiresComponents = variant.requiresComponents;
          break;
        case "description":
          input.description = variant.description;
          break;
        case "metafields":
          input.metafields = variant.metafields;
          break;
        default:
          break;
      }
    }

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
      { input }
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
          description: {
            type: "string",
          },
          metafields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                namespace: {
                  type: "string",
                },
                key: {
                  type: "string",
                },
                type: {
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
    },
  },
};
