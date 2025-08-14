export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { shopId, productId, metaobjectId, approved } = params;

  if (!shopId || !productId || !metaobjectId)
    throw new Error("Missing required parameters");

  let value;

  // Create a Shopify API instance for the given shopId
  const shopify = await connections.shopify.forShopId(shopId);

  // Get the existing product metafield
  const product = await api.shopifyProduct.maybeFindOne(productId, {
    select: {
      reviewsMetafield: true,
    },
  });

  // If no product is found, throw an error
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

  // If no value is set, return early
  if (!value) return;

  // Update the product's metafield with the new value
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
          value,
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
  metaobjectId: {
    type: "string",
  },
  approved: {
    type: "boolean",
  },
};
