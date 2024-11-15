import {
  deleteRecord,
  ActionOptions,
  DeleteWishlistItemActionContext,
  preventCrossShopDataAccess,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { DeleteWishlistItemActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteWishlistItemActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Update the wishlist metafield after deleting a wishlist item
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
