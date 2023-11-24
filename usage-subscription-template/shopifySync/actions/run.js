import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  shopifySync,
  ActionOptions,
  ShopifySyncState,
  RunShopifySyncActionContext,
} from "gadget-server";

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, { to: ShopifySyncState.Running });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      inTrial: true,
      paused: true,
    },
  });

  if (shop && (shop?.inTrial || !shop?.paused)) {
    await save(record);
    await shopifySync(params, record);
  }
}

/**
 * @param { RunShopifySyncActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
