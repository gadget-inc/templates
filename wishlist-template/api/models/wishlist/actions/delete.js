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
  await api.internal.wishlistItem.deleteMany({
    filter: {
      wishlist: {
        equals: record.id,
      },
    },
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
