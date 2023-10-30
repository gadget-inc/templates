import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SetSalesDayShopifyOrderTransactionActionContext,
} from "gadget-server";
import { sendSlackNotification } from "./helpers";

/**
 * @param { SetSalesDayShopifyOrderTransactionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { SetSalesDayShopifyOrderTransactionActionContext } context Runs notification sending code if the salesDay target has been reached
 *
 */
export async function onSuccess({ params, record, logger, api }) {
  const salesDay = await api.salesDay.maybeFindOne(record.salesDayId, {
    select: {
      id: true,
      sales: true,
      percentage: true,
      sentFirstNotification: true,
      sentSecondNotification: true,
      salesMonth: {
        id: true,
        sales: true,
        percentage: true,
        sentFirstNotification: true,
        sentSecondNotification: true,
      },
      shop: {
        currency: true,
        slackAccessToken: true,
        slackChannelId: true,
      },
    },
  });

  if (salesDay?.shop?.slackAccessToken && salesDay?.shop?.slackChannelId) {
    if (salesDay.percentage >= 1 && !salesDay.sentSecondNotification) {
      await sendSlackNotification({
        api,
        id: salesDay.id,
        daily: true,
        sales: salesDay.sales,
        currency: salesDay.shop.currency,
        token: salesDay.shop.slackAccessToken,
        channel: salesDay.shop.slackChannelId,
      });
    } else if (
      salesDay.percentage >= 0.75 &&
      !salesDay.sentFirstNotification &&
      !salesDay.sentSecondNotification
    ) {
      await sendSlackNotification({
        api,
        id: salesDay.id,
        firstNotification: true,
        daily: true,
        sales: salesDay.sales,
        currency: salesDay.shop.currency,
        token: salesDay.shop.slackAccessToken,
        channel: salesDay.shop.slackChannelId,
      });
    }

    if (
      salesDay.salesMonth.percentage >= 1 &&
      !salesDay.salesMonth.sentSecondNotification
    ) {
      await sendSlackNotification({
        api,
        id: salesDay.salesMonth.id,
        sales: salesDay.salesMonth.sales,
        currency: salesDay.shop.currency,
        token: salesDay.shop.slackAccessToken,
        channel: salesDay.shop.slackChannelId,
      });
    } else if (
      salesDay.salesMonth.percentage >= 0.75 &&
      !salesDay.salesMonth.sentFirstNotification &&
      !salesDay.salesMonth.sentSecondNotification
    ) {
      await sendSlackNotification({
        api,
        id: salesDay.salesMonth.id,
        firstNotification: true,
        sales: salesDay.salesMonth.sales,
        currency: salesDay.shop.currency,
        token: salesDay.shop.slackAccessToken,
        channel: salesDay.shop.slackChannelId,
      });
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
