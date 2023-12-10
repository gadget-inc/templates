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
export async function onSuccess({ params, record, logger, api }) {
  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      slackAccessToken: true,
      slackChannelId: true,
    },
  });

  if (
    shop?.slackAccessToken &&
    shop?.slackChannelId &&
    (record.kind === "sale" || record.kind === "capture") &&
    record.status === "success"
  ) {
    try {
      const order = await api.shopifyOrder.maybeFindOne(record.orderId, {
        select: {
          customer: {
            firstName: true,
            lastName: true,
          },
        },
      });

      if (order) {
        await slackClient.chat.postMessage({
          token: shop.slackAccessToken,
          channel: shop.slackChannelId,
          text: `You made a sale! ${
            order?.customer?.firstName && order?.customer?.lastName
              ? order.customer.firstName + " " + order.customer.lastName
              : "Unknown"
          } just spent ${record.amount} ${record.currency} on your store!`,
        });
      }
    } catch (error) {
      logger.error({ error });
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
