import { logger, api } from "gadget-server";
import { slackClient } from "../../../../utilities";

export default async ({
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
