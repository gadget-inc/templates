import {
  applyParams,
  save,
  ActionOptions,
  CreateWishlistActionContext,
  preventCrossShopDataAccess,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { CreateWishlistActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateWishlistActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Add a random image to the wishlist on creation. Might be good to give the user the option to upload their own image.
  await api.wishlist.update(record.id, {
    image: {
      copyURL: "https://picsum.photos/200",
    },
  });

  // Update the wishlist metafield to include the new wishlist
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
