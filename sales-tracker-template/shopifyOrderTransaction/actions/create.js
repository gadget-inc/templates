import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyOrderTransactionActionContext,
} from "gadget-server";
import {
  getDaysInMonth,
  getDayStartAndEndDates,
  getMonthStartAndEndDates,
} from "../../utilities";
import { DateTime } from "luxon";
import CurrencyConverter from "currency-converter-lt";

/**
 * @param { CreateShopifyOrderTransactionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const shop = await api.shopifyShop.findOne(record.shopId, {
    select: {
      currency: true,
    },
  });

  const currencyConverter = new CurrencyConverter();
  record.shopMoney = await currencyConverter
    .from(record.currency)
    .to(shop.currency)
    .convert(parseFloat(record.amount));
  await save(record);
}

/**
 * @param { CreateShopifyOrderTransactionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  if (
    (record.kind === "sale" || record.kind === "capture") &&
    record.status === "success"
  ) {
    const createdAt = new Date(record.shopifyCreatedAt);

    const salesDay = await api.salesDay.maybeFindFirst({
      filter: {
        AND: [
          {
            startDate: {
              lessThanOrEqual: createdAt,
            },
            endDate: {
              greaterThanOrEqual: createdAt,
            },
          },
        ],
      },
      select: {
        id: true,
        salesMonthId: true,
        shop: {
          ianaTimezone: true,
        },
      },
    });

    if (salesDay) {
      await api.shopifyOrderTransaction.setSalesDay(record.id, {
        salesDay: {
          _link: salesDay.id,
        },
        salesMonth: {
          _link: salesDay.salesMonthId,
        },
      });
    } else {
      const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
        select: {
          ianaTimezone: true,
        },
      });

      const daysInMonth = getDaysInMonth(createdAt);
      const { monthLowerBound, monthUpperBound } = getMonthStartAndEndDates(
        shop.ianaTimezone,
        createdAt
      );

      const salesDays = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const {
          dayLowerBound: newSalesDayLowerBound,
          dayUpperBound: newSalesDayUpperBound,
        } = getDayStartAndEndDates(
          shop.ianaTimezone,
          DateTime.fromJSDate(monthLowerBound, {
            zone: shop.ianaTimezone,
          })
            .set({ day: i })
            .toJSDate()
        );

        if (
          newSalesDayLowerBound.getTime() <= createdAt &&
          newSalesDayUpperBound.getTime() >= createdAt
        ) {
          salesDays.push({
            create: {
              startDate: newSalesDayLowerBound,
              endDate: newSalesDayUpperBound,
              shop: {
                _link: record.shopId,
              },
              orderTransactions: [
                {
                  update: {
                    id: record.id,
                  },
                },
              ],
            },
          });
        } else {
          salesDays.push({
            create: {
              startDate: newSalesDayLowerBound,
              endDate: newSalesDayUpperBound,
              shop: {
                _link: record.shopId,
              },
            },
          });
        }
      }

      await api.salesMonth.create(
        {
          startDate: monthLowerBound,
          endDate: monthUpperBound,
          shop: {
            _link: record.shopId,
          },
          salesDays,
          orderTransactions: [
            {
              update: {
                id: record.id,
              },
            },
          ],
        },
        {
          select: {
            id: true,
            salesDays: {
              edges: {
                node: {
                  id: true,
                  startDate: true,
                },
              },
            },
          },
        }
      );
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
