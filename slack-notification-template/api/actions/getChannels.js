import { GetChannelsGlobalActionContext } from "gadget-server";
import { slackClient } from "../../utilities";

/**
 * @param { GetChannelsGlobalActionContext } context
 *
 * Global action used to fetch and format Slack channels to be consumed in the frontend
 */
export async function run({ params, logger, api, connections }) {
  // Setting the default channels array that is to be returned if there aren't any channels
  const channels = [];
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
      // Fetching 1000 Slack channels (no pagination)
      const result = await slackClient.conversations.list({
        token: shop.slackAccessToken,
        limit: 1000,
      });

      // Formatting the data and adding it to the channels array
      for (const channel of result.channels) {
        channels.push({ label: channel.name, value: channel.id });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Returning a sorted array of Slack channels with a None option as the first position
   *
   * "None selected" is used as the option to remove the Slack bot from the last channel it was on (and not join another)
   */
  channels
    .sort((a, b) => a.label.localeCompare(b.label))
    .unshift({ label: "None selected", value: "" });

  return channels;
}

export const options = { triggers: { api: true } }