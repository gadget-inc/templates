import {
  applyParams,
  save,
  transitionState,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // start a Shopify sync for products on install
  await api.shopifySync.run({
    shopifySync: {
      domain: record.domain,
      shop: {
        _link: record.id,
      },
      models: ["shopifyProduct", "shopifyTheme", "shopifyAsset"],
    },
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
