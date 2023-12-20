import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  ReinstallShopifyShopActionContext,
} from "gadget-server";
import { createCarrierService } from "../helpers";

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
  actionType: "update",
};
