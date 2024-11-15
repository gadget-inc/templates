import { RemoveFromWishlistGlobalActionContext } from "gadget-server";

/**
 * @param { RemoveFromWishlistGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { variantId, customerId, shopId, wishlistId } = params;

  // Find the wishlist item that matches the given parameters
  const wishlistItem = await api.wishlistItem.maybeFindFirst({
    filter: {
      wishlistId: {
        equals: wishlistId,
      },
      shopId: {
        equals: shopId,
      },
      customerId: {
        equals: customerId,
      },
      variantId: {
        equals: variantId,
      },
    },
    select: {
      id: true,
    },
  });

  // If the wishlist item is not found, return an error
  if (!wishlistItem) {
    return {
      success: false,
      message: "Wishlist item not found",
    };
  }

  // Delete the wishlist item
  await api.wishlistItem.delete(wishlistItem.id);

  return {
    success: true,
  };
}

export const params = {
  variantId: {
    type: "string",
  },
  customerId: {
    type: "string",
  },
  shopId: {
    type: "string",
  },
  wishlistId: {
    type: "string",
  },
};
