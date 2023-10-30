import { logger } from "gadget-server";
import { slackClient } from "../../../utilities";
import { Client } from "@gadget-client/sales-tracker-template";

/**
 * @async Calls the Slack API to send a message
 * @param { { api: Client, accessToken: string, channelId: string, daily: boolean, firstNotification: boolean, sales: number, currency: string, id: string } } params Information required for sending a notification (message) to a Slack channelId
 *
 * @returns { Promise<void> }
 */
export default async ({
  api,
  accessToken,
  channelId,
  daily = false,
  firstNotification = false,
  sales,
  currency,
  id,
}) => {
  try {
    await slackClient.chat.postMessage({
      accessToken,
      channelId,
      text: `You have just hit ${firstNotification ? 75 : 100}% of your ${
        daily ? "daily" : "monthly"
      } target! You are currently at ${sales} ${currency} in sales.`,
    });

    const params = {};

    params[
      firstNotification ? "sentFirstNotification" : "sentSecondNotification"
    ] = true;

    if (daily) {
      await api.salesDay.update(id, params);
    } else {
      await api.salesMonth.update(id, params);
    }
  } catch (error) {
    logger.error({ error });
  }
};
