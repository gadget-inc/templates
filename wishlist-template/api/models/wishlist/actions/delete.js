import {
  deleteRecord,
  ActionOptions,
  DeleteWishlistActionContext,
} from "gadget-server";

/**
 * @param { DeleteWishlistActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
}

/**
 * @param { DeleteWishlistActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  let wishlistItems = await api.wishlistItem.findMany({
    filter: {
      wishlist: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  let allWishlistItems = wishlistItems;

  while (wishlistItems.hasNextPage) {
    wishlistItems = await wishlistItems.nextPage();
    allWishlistItems = allWishlistItems.concat(wishlistItems);
  }

  await api.internal.wishlistItem.deleteMany({
    filter: {
      id: {
        in: allWishlistItems.map((wishlistItem) => wishlistItem.id),
      },
    },
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
