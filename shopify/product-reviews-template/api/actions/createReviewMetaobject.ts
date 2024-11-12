export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, review } = params;

  if (!shopId) throw new Error("shopId is required");
  if (!review || !review?.id) throw new Error("review is required");

  const shopify = await connections.shopify.forShopId(shopId);

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
              value: review.rating,
              scale_max: "5",
              scale_min: "0",
            }),
          },
          {
            key: "content",
            value: review.content,
          },
          {
            key: "product",
            value: `gid://shopify/Product/${review.productId}`,
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

  await api.internal.review.update(review.id, {
    metaobjectId: metaobjectCreateResponse.metaobjectCreate.metaobject.id,
  });
};

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
