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
      variant: { price, requiresComponents, description },
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
      },
    }
  );

  if (productCreateResponse?.productCreate?.userErrors?.length)
    throw new Error(productCreateResponse.productCreate.userErrors[0].message);

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
        id: productCreateResponse?.productCreate?.product?.variants?.edges[0]
          ?.node?.id,
        price: price.toFixed(2),
        requiresComponents,
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
        ],
      },
    }
  );

  if (productVariantUpdateResponse?.productVariantCreate?.userErrors?.length)
    throw new Error(
      productVariantUpdateResponse.productVariantCreate.userErrors[0].message
    );

  await api.internal.bundle.update(id, {
    bundleVariant: {
      _link:
        productCreateResponse?.productCreate?.product?.variants?.edges[0]?.node?.id.split(
          "/"
        )[4],
    },
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
          requiresComponents: {
            type: "boolean",
          },
          description: {
            type: "string",
          },
        },
      },
    },
  },
};
