import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  ReinstallShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, {
    from: ShopifyShopState.Uninstalled,
    to: ShopifyShopState.Installed,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};
