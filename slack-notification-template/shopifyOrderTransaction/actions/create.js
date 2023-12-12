import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyOrderTransactionActionContext,
} from "gadget-server";
import { slackClient } from "../../utilities";

/**
 * @param { CreateShopifyOrderTransactionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyOrderTransactionActionContext } context
 */
export async function onSuccess({ params, record, logger, api, trigger }) {
  if (
    trigger.type === "shopify_webhook" &&
    (record.kind === "sale" || record.kind === "capture") &&
    record.status === "success"
  ) {
    const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
      select: {
        slackAccessToken: true,
        slackChannelId: true,
      },
    });

    if (shop?.slackAccessToken && shop?.slackChannelId) {
      await slackClient.chat.postMessage({
        token: shop.slackAccessToken,
        channel: shop.slackChannelId,
        text: `You made a sale! ${
          record.paymentDetails.credit_card_name || "Unknown"
        } just spent ${record.amount} ${record.currency} on your store!`,
      });
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
