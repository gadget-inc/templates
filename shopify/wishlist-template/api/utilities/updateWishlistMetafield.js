import { api, connections } from "gadget-server";

export default async ({ shopId, customerId }) => {
  // INstantiate the Shopify API and fetch the first page of wishlists
  let [shopify, wishlists] = await Promise.all([
    connections.shopify.forShopId(shopId),
    api.wishlist.findMany({
      first: 250,
      filter: {
        customerId: {
          equals: customerId,
        },
        shopId: {
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

  // Paginate to get all the wishlists
  while (wishlists.hasNextPage) {
    wishlists = await wishlists.nextPage();
    allWishlists = allWishlists.concat(wishlists);
  }

  const wishlistObj = {};

  // Create an object to map wishlist items to wishlists
  for (const { id, name } of allWishlists) {
    wishlistObj[id] = {
      id,
      name,
      variants: {},
    };
  }

  // Fetch the first page of wishlist items
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

  // Paginate to get all the wishlist items
  while (wishlistItems.hasNextPage) {
    wishlistItems = await wishlistItems.nextPage();
    allWishlistItems = allWishlistItems.concat(wishlistItems);
  }

  // Add the variant to the wishlist object
  for (const { variantId, wishlistId } of allWishlistItems) {
    wishlistObj[wishlistId].variants[variantId] = true;
  }

  // Update the metafield with the new wishlist object
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
          type: "json",
        },
      ],
    }
  );

  if (metafieldsSetResponse?.metafieldsSet?.userErrors?.length)
    throw new Error(metafieldsSetResponse.metafieldsSet.userErrors[0].message);
};
