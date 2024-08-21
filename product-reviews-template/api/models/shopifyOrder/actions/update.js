import {
  applyParams,
  save,
  ActionOptions,
  UpdateShopifyOrderActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { DateTime } from "luxon";

/**
 * @param { UpdateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (
    record.changed("fulfillmentStatus") &&
    record.fulfillmentStatus === "fulfilled"
  ) {
    const shop = await api.shopifyShop.findOne(record.shopId, {
      select: {
        daysUntilReviewRequest: true,
      },
    });

    record.requestReviewAfter = DateTime.fromJSDate(
      new Date(record.shopifyCreatedAt)
    )
      .plus({ days: shop.daysUntilReviewRequest })
      .toJSDate();
  }

  await save(record);
}

/**
 * @param { UpdateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = { actionType: "update" };
