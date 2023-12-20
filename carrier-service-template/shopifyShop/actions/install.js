import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from "gadget-server";
import { createCarrierService } from "../helpers";

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
export async function onSuccess({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  const carrierServiceId = await createCarrierService({
    shopify: connections.shopify.current,
    currentAppUrl,
  });

  await api.internal.shopifyShop.update(record.id, {
    carrierServiceId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
