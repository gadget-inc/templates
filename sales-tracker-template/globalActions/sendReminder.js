import { SendReminderGlobalActionContext } from "gadget-server";
import { getMonthStartAndEndDates, slackClient } from "../utilities";
import { DateTime } from "luxon";

/**
 * @param { SendReminderGlobalActionContext } context
 */
export async function run({ params, logger, api }) {
  let shops = await api.shopifyShop.findMany({
    select: {
      id: true,
      installedViaApiKey: true,
      domain: true,
      ianaTimezone: true,
      slackAccessToken: true,
      slackChannelId: true,
    },
    filter: {
      AND: [
        {
          slackAccessToken: {
            isSet: true,
          },
        },
        {
          slackChannelId: {
            isSet: true,
          },
        },
      ],
    },
    first: 250,
  });

  let allShops = shops;

  while (shops.hasNextPage) {
    shops = await shops.nextPage();
    allShops = allShops.concat(shops);
  }

  for (const shop of allShops) {
    const date = DateTime.fromJSDate(
      getMonthStartAndEndDates(shop.ianaTimezone, new Date()).monthLowerBound
    )
      .plus({ months: 1 })
      .toJSDate();
    const month = await api.salesMonth.maybeFindFirst({
      select: {
        id: true,
      },
      filter: {
        AND: [
          {
            shop: {
              equals: shop.id,
            },
          },
          {
            startDate: {
              equals: date,
            },
          },
        ],
      },
    });

    if (!month) {
      const res = await slackClient.chat.postMessage({
        token: shop.slackAccessToken,
        channel: shop.slackChannelId,
        text: `We're getting close to ${DateTime.fromJSDate(
          date
        ).toLocaleString({
          month: "long",
          year: "numeric",
        })} and it looks like you haven't added a target for that month. You can add a target by following this link: https://${
          shop.domain
        }/admin/apps/${shop.installedViaApiKey}`,
      });
    }
  }
}
