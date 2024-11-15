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
  await api.shopifySync.run({
    domain: record.domain,
    shop: {
      _link: record.id,
    },
    models: ["shopifyProduct"],
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: false },
};
