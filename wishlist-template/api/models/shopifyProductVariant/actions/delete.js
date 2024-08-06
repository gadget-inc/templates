import {
  save,
  ActionOptions,
  DeleteShopifyProductVariantActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { setModifiedTrue } from "../utilities";

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);

  record.deleted = true;

  await save(record);
}

/**
 * @param { DeleteShopifyProductVariantActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = { actionType: "delete" };
