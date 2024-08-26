import {
  save,
  ActionOptions,
  DeleteShopifyProductActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);

  // Don't actually delete the record, just mark it as deleted
  record.deleted = true;

  await save(record);
}

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Handle logic for marking as a deleted product
}

/** @type { ActionOptions } */
export const options = { actionType: "delete" };
