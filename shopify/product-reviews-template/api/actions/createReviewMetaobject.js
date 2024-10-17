import { CreateReviewMetaobjectGlobalActionContext } from "gadget-server";

/**
 * @param { CreateReviewMetaobjectGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const {
    shopId,
    review: { id, rating, content, productId },
  } = params;

  const shopify = connections.shopify.forShop(shopId);

  // Create the metaobject
  const metaobjectCreateResponse = await shopify.graphql(
    `mutation ($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
        }
        userErrors {
          message
        }
      }
    }`,
    {
      metaobject: {
        type: "review",
        fields: [
          {
            key: "anonymous",
            // Change later if you desire to display names of the reviewer
            value: "true",
          },
          {
            key: "rating",
            value: JSON.stringify({
              value: rating,
              scale_max: "5",
              scale_min: "0",
            }),
          },
          {
            key: "content",
            value: content,
          },
          {
            key: "product",
            value: `gid://shopify/Product/${productId}`,
          },
        ],
      },
    }
  );

  // Throw an error if Shopify returns an error
  if (metaobjectCreateResponse?.metaobjectCreate?.userErrors?.length)
    throw new Error(
      metaobjectCreateResponse.metaobjectCreate.userErrors[0].message
    );

  await api.internal.review.update(id, {
    metaobjectId: metaobjectCreateResponse.metaobjectCreate.metaobject.id,
  });
}

export const params = {
  shopId: { type: "string" },
  review: {
    type: "object",
    properties: {
      id: { type: "string" },
      rating: { type: "number" },
      content: { type: "string" },
      productId: { type: "string" },
    },
  },
};
