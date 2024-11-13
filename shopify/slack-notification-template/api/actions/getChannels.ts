import { slackClient } from "../../utilities";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  // Setting the default channels array that is to be returned if there aren't any channels
  let channels: { label: string; value: string }[] = [];
  const shop = await api.shopifyShop.maybeFindOne(
    String(connections.shopify.currentShopId),
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
        token: shop.slackAccessToken ?? "",
        limit: 1000,
      });

      if (!result?.channels) throw new Error("No channels found");

      // Formatting the data and adding it to the channels array
      channels = result.channels.reduce(
        (acc, channel) => {
          if (!channel.is_archived && channel.name && channel.id) {
            acc.push({ label: channel.name, value: channel.id });
          }
          return acc;
        },
        [] as { label: string; value: string }[]
      );
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Returning a sorted array of Slack channels with a None option as the first position
   *
   * "None selected" is used as the option to remove the Slack bot from the last channel it was on (and not join another)
   */
  channels
    .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""))
    .unshift({ label: "None selected", value: "" });

  return channels;
};

export const options = { triggers: { api: true } };
