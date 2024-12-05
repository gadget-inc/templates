export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, bundle, productChanges, variantChanges } = params;

  if (!shopId) throw new Error("Shop ID not provided");

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  if (productChanges?.length) {
    if (!bundle?.product?.id) throw new Error("Bundle product ID not found");

    const { id: productId, ...productData } = bundle?.product;

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
    if (!bundle?.variant?.id) throw new Error("Bundle variant ID not found");

    const { id: variantId, ...variantData } = bundle?.variant;

    // Update the product variant with the new data
    const productVariantUpdateResponse = await shopify.graphql(
      `mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors {
            message
          }
        }
      }`,
      {
        productId: `gid://shopify/Product/${bundle?.product?.id}`,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${variantId}`,
            ...variantData,
          },
        ],
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
        bundleVariantId: variantId,
        bundleId: bundle.id,
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
};

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
                namespace: {
                  type: "string",
                },
                key: {
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
