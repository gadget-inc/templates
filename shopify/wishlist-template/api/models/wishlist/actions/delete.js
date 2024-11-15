import {
  deleteRecord,
  ActionOptions,
  DeleteWishlistActionContext,
  preventCrossShopDataAccess,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { DeleteWishlistActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteWishlistActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Delete all wishlist items associated with the wishlist
  await api.internal.wishlistItem.deleteMany({
    filter: {
      wishlistId: {
        equals: record.id,
      },
    },
  });

  // Update the wishlist metafield
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
