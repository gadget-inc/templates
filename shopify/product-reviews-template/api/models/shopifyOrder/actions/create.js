import {
  applyParams,
  save,
  ActionOptions,
  CreateShopifyOrderActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { default as code } from "short-uuid";

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  record.singleUseCode = code.generate();

  await save(record);
}

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };