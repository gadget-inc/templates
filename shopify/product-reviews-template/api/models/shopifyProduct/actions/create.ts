import {
  applyParams,
  save,
  ActionOptions,
  CreateShopifyProductActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.enqueue(
    api.createReviewsMetafield,
    {
      shopId: record.shopId,
      productId: record.id,
    },
    {
      queue: {
        name: `queue-shop:${record.shopId}`,
        maxConcurrency: 4,
      },
    }
  );
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };
