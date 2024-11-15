import {
  applyParams,
  save,
  ActionOptions,
  UpdateWishlistItemActionContext,
  preventCrossShopDataAccess,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { UpdateWishlistItemActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateWishlistItemActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Update the wishlist metafield after updating a wishlist
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
