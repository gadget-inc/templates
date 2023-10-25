import { GetChannelsGlobalActionContext } from "gadget-server";
import { slackClient } from "../utilities";

/**
 * @param { GetChannelsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const channels = [{ label: "None selected", value: "" }];
  const shop = await api.shopifyShop.maybeFindOne(
    connections.shopify.currentShopId,
    {
      select: {
        slackAccessToken: true,
      },
    }
  );

  if (shop) {
    try {
      const result = await slackClient.conversations.list({
        token: shop.slackAccessToken,
        limit: 1000,
      });

      for (const channel of result.channels) {
        channels.push({ label: channel.name, value: channel.id });
      }
    } catch (error) {
      logger.error({ error });
    }
  }
  return channels;
}
