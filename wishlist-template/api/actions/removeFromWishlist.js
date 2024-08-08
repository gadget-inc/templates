import { RemoveFromWishlistGlobalActionContext } from "gadget-server";

/**
 * @param { RemoveFromWishlistGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { variantId, customerId, shopId, wishlistId } = params;

  logger.info({ params }, "Removing item from wishlist");

  const wishlistItem = await api.wishlistItem.maybeFindFirst({
    filter: {
      wishlist: {
        equals: wishlistId,
      },
      shop: {
        equals: shopId,
      },
      customer: {
        equals: customerId,
      },
      variant: {
        equals: variantId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!wishlistItem) {
    return {
      success: false,
      message: "Wishlist item not found",
    };
  }

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
