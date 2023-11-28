import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyAppSubscriptionActionContext,
} from "gadget-server";

/**
 * @param { CreateShopifyAppSubscriptionActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyAppSubscriptionActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.internal.shopifyShop.update(record.shopId, {
    billingPeriodStart: new Date(record.shopifyCreatedAt),
    billingPeriodEnd: new Date(record.currentPeriodEnd),
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
