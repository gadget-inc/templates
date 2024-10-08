import {
  applyParams,
  save,
  ActionOptions,
  ReinstallShopifyShopActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
}

/** @type { ActionOptions } */
export const options = { actionType: "update" };
