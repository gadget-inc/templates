import { UpdateReviewsMetafieldGlobalActionContext } from "gadget-server";

/**
 * @param { UpdateReviewsMetafieldGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { shopId, productId, metaobjectId, approved } = params;

  let value;

  const shopify = await connections.shopify.forShopId(shopId);

  // Build the metafield value

  const product = await api.shopifyProduct.maybeFindOne(productId, {
    select: {
      reviewsMetafield: true,
    },
  });

  if (!product) throw new Error("Product not found");

  if (approved) {
    product.reviewsMetafield.push(metaobjectId);

    value = JSON.stringify(product.reviewsMetafield);
  } else {
    const index = product.reviewsMetafield.indexOf(metaobjectId);

    if (index === -1) {
      value = JSON.stringify(product.reviewsMetafield.splice(index, 1));
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
          namespace: "productReviews",
          ownerId: `gid://shopify/Product/${productId}`,
          type: "list.metaobject_reference",
          value,
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
  metaobjectId: {
    type: "string",
  },
  approved: {
    type: "boolean",
  },
};
