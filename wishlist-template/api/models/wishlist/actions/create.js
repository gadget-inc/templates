import { applyParams, save, ActionOptions, CreateWishlistActionContext } from "gadget-server";

/**
 * @param { CreateWishlistActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateWishlistActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.wishlist.update(record.id, {
    image: {
      copyURL: "https://picsum.photos/200"
    }
  })
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
