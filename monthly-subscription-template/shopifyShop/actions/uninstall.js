import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, {
    from: ShopifyShopState.Installed,
    to: ShopifyShopState.Uninstalled,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.internal.shopifyAppSubscription.update(
    record.activeRecurringSubscriptionId,
    {
      status: "CANCELLED",
    }
  );

  await api.internal.shopifyShop.update(record.id, {
    activeRecurringSubscriptionId: null,
    plan: null,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
