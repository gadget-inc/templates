import {
  deleteRecord,
  ActionOptions,
  DeleteShopifyCustomerActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { DeleteShopifyCustomerActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteShopifyCustomerActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const wishlist = await api.wishlist.maybeFindFirst({
    filter: {
      customer: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (wishlist) {
    await api.internal.wishlist.delete(wishlist.id);
  }
}

/** @type { ActionOptions } */
export const options = { actionType: "delete" };
