import {
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductVariantActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  let wishlistItems = await api.wishlistItem.findMany({
    filter: {
      variant: {
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
export const options = { actionType: "delete" };
