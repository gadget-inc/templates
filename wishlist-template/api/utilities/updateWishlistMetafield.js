import { api, connections, logger } from "gadget-server";

export default async ({ shopId, customerId }) => {
  let [shopify, wishlists] = await Promise.all([
    connections.shopify.forShopId(shopId),
    api.wishlist.findMany({
      first: 250,
      filter: {
        customer: {
          equals: customerId,
        },
        shop: {
          equals: shopId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  let allWishlists = wishlists;

  while (wishlists.hasNextPage) {
    wishlists = await wishlists.nextPage();
    allWishlists = allWishlists.concat(wishlists);
  }

  const wishlistObj = {};

  for (const { id, name } of allWishlists) {
    wishlistObj[id] = {
      id,
      name,
      variants: {},
    };
  }

  let wishlistItems = await api.wishlistItem.findMany({
    first: 250,
    filter: {
      customer: {
        equals: customerId,
      },
      shop: {
        equals: shopId,
      },
    },
    select: {
      variantId: true,
      wishlistId: true,
    },
  });

  let allWishlistItems = wishlistItems;

  while (wishlistItems.hasNextPage) {
    wishlistItems = await wishlistItems.nextPage();
    allWishlistItems = allWishlistItems.concat(wishlistItems);
  }

  for (const { variantId, wishlistId } of allWishlistItems) {
    wishlistObj[wishlistId].variants[variantId] = true;
  }

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
          key: "wishlists",
          namespace: "wishlist_app",
          ownerId: `gid://shopify/Customer/${customerId}`,
          value: JSON.stringify(Object.values(wishlistObj)),
        },
      ],
    }
  );

  if (metafieldsSetResponse?.metafieldsSet?.userErrors?.length)
    throw new Error(metafieldsSetResponse.metafieldsSet.userErrors[0].message);
};
