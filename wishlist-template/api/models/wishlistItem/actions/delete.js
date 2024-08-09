import {
  deleteRecord,
  ActionOptions,
  DeleteWishlistItemActionContext,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { DeleteWishlistItemActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
}

/**
 * @param { DeleteWishlistItemActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
