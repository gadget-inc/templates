export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, productId } = params;

  if (!shopId) throw new Error("shopId is required");

  // Create a Shopify API instance for the given shopId
  const shopify = await connections.shopify.forShopId(shopId);

  // Create a metafield to store the review metaobjects for the product
  const response = await shopify.graphql(
    `mutation ($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
        }
        userErrors {
          message
        }
      }
    }`,
    {
      metafields: [
        {
          key: "reviewMetaobjects",
          namespace: "productReviews",
          ownerId: `gid://shopify/Product/${productId}`,
          type: "list.metaobject_reference",
          value: "[]",
        },
      ],
    }
  );

  // Throw an error if Shopify returns an error
  if (response?.metafieldsSet?.userErrors?.length)
    throw new Error(response.metafieldsSet.userErrors[0].message);
};

export const params = {
  shopId: {
    type: "string",
  },
  productId: {
    type: "string",
  },
};
