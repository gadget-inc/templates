import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from "gadget-server";
import { getMonthStartAndEndDates } from "../../utilities";

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
    shop: {
      _link: record.id,
    },
    domain: record.domain,
    syncSince: getMonthStartAndEndDates(record.ianaTimezone).monthLowerBound,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
