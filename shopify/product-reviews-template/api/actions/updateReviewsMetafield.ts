export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, productId, metaobjectId, approved } = params;

  if (!shopId || !productId || !metaobjectId)
    throw new Error("Missing required parameters");

  let value;

  // eslint-disable-next-line
  const shopify = await connections.shopify.forShopId(shopId);

  // Build the metafield value
  const product = await api.shopifyProduct.maybeFindOne(productId, {
    select: {
      reviewsMetafield: true,
    },
  });

  if (!product) throw new Error("Product not found");

  const reviewsArray = product.reviewsMetafield as string[];

  if (approved) {
    reviewsArray.push(metaobjectId);

    value = JSON.stringify(product.reviewsMetafield);
  } else {
    const index = reviewsArray.indexOf(metaobjectId);

    if (index === -1) {
      value = JSON.stringify(reviewsArray.splice(index, 1));
    }
  }

  if (!value) return;

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
          namespace: "$app:productReviews",
          ownerId: `gid://shopify/Product/${productId}`,
          type: "list.metaobject_reference",
          value,
        },
      ],
    }
  );

  if (metafieldsSetResponse?.metafieldsSet?.userErrors?.length)
    throw new Error(metafieldsSetResponse.metafieldsSet.userErrors[0].message);
};

export const params = {
  shopId: {
    type: "string",
  },
  productId: {
    type: "string",
  },
  metaobjectId: {
    type: "string",
  },
  approved: {
    type: "boolean",
  },
};
