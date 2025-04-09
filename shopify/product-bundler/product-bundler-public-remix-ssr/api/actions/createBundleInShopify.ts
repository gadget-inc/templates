import { fetchVariantGIDs } from "../utils";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, bundle } = params;

  if (!shopId) throw new Error("Shop ID not provided");
  if (
    !bundle?.id ||
    !bundle.product?.status ||
    !bundle.product.title ||
    !bundle.variant?.description ||
    !bundle.variant?.price
  )
    throw new Error("Bundle properties not provided");

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  // Creates a product in Shopify that will act as the bundle in the oneline store
  const productCreateResponse = await shopify.graphql(
    `mutation($productInput: ProductInput!) {
      productCreate(input: $productInput) {
        product {
          id
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      productInput: {
        status: bundle?.product?.status?.toUpperCase(),
        title: bundle?.product?.title,
        descriptionHtml: bundle?.variant?.description,
        claimOwnership: {
          bundles: true,
        },
      },
    }
  );

  // Throw an error if the product creation fails
  if (productCreateResponse?.productCreate?.userErrors?.length)
    throw new Error(productCreateResponse.productCreate.userErrors[0].message);

  // Fetch all the bundle components for the bundle
  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: {
        equals: bundle?.id,
      },
    },
    select: {
      productVariantId: true,
      quantity: true,
    },
  });

  const quantityObj: { [key: string]: number | null } = {};

  // Creates an object with product variant ids as keys and their quantities as values
  for (const bundleComponent of bundleComponents) {
    if (bundleComponent.productVariantId)
      quantityObj[bundleComponent.productVariantId] =
        bundleComponent.quantity ?? 0;
  }

  /**
   * Updates the product variant with the price and the metafields
   * - componentReference: An array of product variant gids
   * - isBundle: Always true. This is used to identify the product variant as a bundle in later logic
   * - productVariantQuantities: An object with the product variant ids as keys and their quantities as values
   */
  const productVariantUpdateResponse = await shopify.graphql(
    `mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors {
            message
          }
        }
      }`,
    {
      productId: productCreateResponse.productCreate.product.id,
      variants: [
        {
          id: productCreateResponse?.productCreate?.product?.variants?.edges[0]
            ?.node?.id,
          price: bundle?.variant?.price?.toFixed(2),
          inventoryPolicy: "CONTINUE", // Make sure to make this configurable. Set to "CONTINUE" for testing
          metafields: [
            {
              namespace: "bundle",
              key: "componentReference",
              type: "list.variant_reference",
              value: JSON.stringify(await fetchVariantGIDs(bundle.id, shopId)),
            },
            {
              namespace: "bundle",
              key: "isBundle",
              type: "boolean",
              value: "true",
            },
            {
              namespace: "bundle",
              key: "productVariantQuantities",
              type: "json",
              value: JSON.stringify(quantityObj),
            },
          ],
          requiresComponents: true,
        },
      ],
    }
  );

  // Throw an error if the product variant update fails
  if (productVariantUpdateResponse?.productVariantUpdate?.userErrors?.length)
    throw new Error(
      productVariantUpdateResponse.productVariantUpdate.userErrors[0].message
    );

  // Fetch the online store publication id for the shop
  const shop = await api.shopifyShop.findOne(shopId, {
    select: {
      onlineStorePublicationId: true,
    },
  });

  // Publish the product to the online store
  const publicationResponse = await shopify.graphql(
    `mutation ($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            availablePublicationsCount {
              count
            }
            resourcePublicationsCount {
              count
            }
          }
          userErrors {
            message
          }
        }
      }`,
    {
      id: productCreateResponse.productCreate.product.id,
      input: {
        publicationId: shop.onlineStorePublicationId,
      },
    }
  );

  // Throw an error if the publication fails
  if (publicationResponse?.publishablePublish?.userErrors?.length)
    throw new Error(
      publicationResponse.publishablePublish.userErrors[0].message
    );

  // Update the bundle using the internal API, linking the bundle to it's parent product variant
  await api.internal.bundle.update(bundle.id, {
    bundleVariant: {
      _link:
        productCreateResponse?.productCreate?.product?.variants?.edges[0]?.node?.id.split(
          "/"
        )[4],
    },
  });
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
      product: {
        type: "object",
        properties: {
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
          price: {
            type: "number",
          },
          description: {
            type: "string",
          },
        },
      },
    },
  },
};
