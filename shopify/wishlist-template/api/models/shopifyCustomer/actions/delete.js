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
  // Delete the customer's wishlist data when the customer is deleted
  await Promise.all([
    api.internal.wishlist.deleteMany({
      filter: {
        customerId: {
          equals: record.id,
        },
      },
    }),
    api.internal.wishlistItem.deleteMany({
      filter: {
        customerId: {
          equals: record.id,
        },
      },
    }),
  ]);
}

/** @type { ActionOptions } */
export const options = { actionType: "delete" };
