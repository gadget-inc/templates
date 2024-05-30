import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyOrderActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";
import { getCappedAmount } from "../../../../utilities";

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shop = await api.shopifyShop.findOne(record.shopId, {
    currency: true,
    activeSubscriptionId: true,
    usagePlanId: true,
    overage: true,
    plan: {
      price: true,
    },
  });

  await api.enqueue(
    api.chargeShop,
    {
      shop: {
        id: record.shopId,
        currency: shop.currency,
        activeSubscriptionId: shop.activeSubscriptionId,
        usagePlanId: shop.usagePlanId,
        overage: shop.overage,
        plan: {
          price: shop.plan.price,
        },
      },
      order: {
        email: record.email,
      },
    },
    {
      queue: {
        name: shop.name,
        maxConcurrency: 4,
      },
    }
  );
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: false },
};
