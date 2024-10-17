import { CreateReviewsMetafieldGlobalActionContext } from "gadget-server";

/**
 * @param { CreateReviewsMetafieldGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { shopId, productId } = params;

  const shopify = await connections.shopify.forShopId(shopId);

  const metafieldsSetResponse = await shopify.graphql(
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

  if (metafieldsSetResponse?.metafieldsSet?.userErrors?.length)
    throw new Error(metafieldsSetResponse.metafieldsSet.userErrors[0].message);
}

export const params = {
  shopId: {
    type: "string",
  },
  productId: {
    type: "string",
  },
};
