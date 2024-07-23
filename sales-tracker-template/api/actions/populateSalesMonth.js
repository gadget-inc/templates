import { CreateSalesMonthGlobalActionContext } from "gadget-server";
import { getMonthStartAndEndDates, getDayStartAndEndDates } from "../../utilities";
import { DateTime } from "luxon";

/**
 * @param { CreateSalesMonthGlobalActionContext } context Global action that creates a new salesMonth and it's child salesDays
 *
 * @returns { void }
 */
export async function run({ params, logger, api, connections }) {
  const {
    shop: { timezone },
    month: { date, target },
    days,
  } = params;
  const shopId = connections.shopify.currentShopId;
  const { monthLowerBound, monthUpperBound } = getMonthStartAndEndDates(
    timezone,
    new Date(new Date(date))
  );

  const salesDays = [];

  for (const day of days) {
    const { dayLowerBound, dayUpperBound } = getDayStartAndEndDates(
      timezone,
      DateTime.fromJSDate(monthLowerBound, {
        zone: timezone,
      })
        .set({ day: day.index })
        .toJSDate()
    );

    salesDays.push({
      create: {
        startDate: dayLowerBound,
        endDate: dayUpperBound,
        target: day.target,
        shop: {
          _link: shopId,
        },
      },
    });
  }

  try {
    await api.salesMonth.create({
      startDate: monthLowerBound,
      endDate: monthUpperBound,
      target: target,
      salesDays,
      shop: {
        _link: shopId,
      },
    });
  } catch (error) {
    logger.error({ error });
  }
}

export const params = {
  shop: {
    type: "object",
    properties: {
      timezone: {
        type: "string",
      },
    },
  },
  days: {
    type: "array",
    items: {
      type: "object",
      properties: {
        index: {
          type: "string",
        },
        target: {
          type: "number",
        },
      },
    },
  },
  month: {
    type: "object",
    properties: {
      date: {
        type: "string",
      },
      target: {
        type: "number",
      },
    },
  },
};

export const options = { triggers: { api: true } }