import {
  deleteRecord,
  ActionOptions,
  DeleteWishlistActionContext,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

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
  await api.internal.wishlistItem.deleteMany({
    filter: {
      wishlist: {
        equals: record.id,
      },
    },
  });

  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
