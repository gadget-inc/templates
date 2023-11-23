import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  UpdateShopifyAppSubscriptionActionContext,
} from "gadget-server";

/**
 * @param { UpdateShopifyAppSubscriptionActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateShopifyAppSubscriptionActionContext } context
 */
export async function onSuccess({
  params,
  record,
  logger,
  api,
  connections,
  trigger,
}) {
  logger.info({ trigger });
  if (trigger.type === "shopify_webhook") {
    const shop = await api.shopifyShop.findOne(record.shopId, {
      select: {
        domain: true,
      },
    });

    await api.shopifySync.run({
      shop: {
        _link: record.shopId,
      },
      domain: shop.domain,
      models: ["shopifyAppSubscription"],
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
