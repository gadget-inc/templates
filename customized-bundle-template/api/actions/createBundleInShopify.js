import { CreateBundleInShopifyGlobalActionContext } from "gadget-server";
import { fetchVariantGIDs } from "../../utilities";

/**
 * @param { CreateBundleInShopifyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const {
    shopId,
    bundle: {
      id,
      product: { title, status },
      variant: { price, description },
    },
  } = params;

  const shopify = await connections.shopify.forShopId(shopId);

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
        status: status.toUpperCase(),
        title: title,
        descriptionHtml: description,
        claimOwnership: {
          bundles: true,
        },
      },
    }
  );

  if (productCreateResponse?.productCreate?.userErrors?.length)
    throw new Error(productCreateResponse.productCreate.userErrors[0].message);

  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundle: {
        equals: id,
      },
    },
    select: {
      productVariantId: true,
      quantity: true,
    },
  });

  const quantityObj = {};

  for (const bundleComponent of bundleComponents) {
    quantityObj[bundleComponent.productVariantId] = bundleComponent.quantity;
  }

  const productVariantUpdateResponse = await shopify.graphql(
    `mutation ($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          metafields(first: 2) {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }`,
    {
      input: {
        id: productCreateResponse?.productCreate?.product?.variants?.edges[0]
          ?.node?.id,
        price: price.toFixed(2),
        metafields: [
          {
            namespace: "bundle",
            key: "componentReference",
            type: "list.variant_reference",
            value: JSON.stringify(await fetchVariantGIDs(id, shopId)),
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
    }
  );

  if (productVariantUpdateResponse?.productVariantUpdate?.userErrors?.length)
    throw new Error(
      productVariantUpdateResponse.productVariantUpdate.userErrors[0].message
    );

  const shop = await api.shopifyShop.findOne(shopId, {
    select: {
      onlineStorePublicationId: true,
    },
  });

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

  if (publicationResponse?.publishablePublish?.userErrors?.length)
    throw new Error(
      publicationResponse.publishablePublish.userErrors[0].message
    );

  let componentReferenceMetafieldId = "";

  for (const metafield of productVariantUpdateResponse.productVariantUpdate
    .productVariant.metafields.edges) {
    if (metafield.node.key === "componentReference") {
      componentReferenceMetafieldId = metafield.node.id;
      break;
    }
  }

  await api.internal.bundle.update(id, {
    bundleVariant: {
      _link:
        productCreateResponse?.productCreate?.product?.variants?.edges[0]?.node?.id.split(
          "/"
        )[4],
    },
    componentReferenceMetafieldId,
  });
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
