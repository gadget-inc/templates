import { BillingPeriodTrackingGlobalActionContext } from "gadget-server";
import { DateTime } from "luxon";

/**
 * @param { BillingPeriodTrackingGlobalActionContext } context
 *
 * Features of this global action:
 * - Runs on a cron trigger (schedule) every 5 minutes
 * - Paginating to fetch all shops where the billingPeriodEnd date has passed
 * - Creates a usage charge for previous billing period overages
 * - Sets the shop billing period information to track the next period
 */
export async function run({ params, logger, api, connections }) {
  let shops = await api.shopifyShop.findMany({
    filter: {
      billingPeriodEnd: {
        lessThanOrEqual: new Date(),
      },
      state: {
        inState: "installed",
      },
      plan: {
        isSet: true,
      },
    },
    select: {
      id: true,
      name: true,
      billingPeriodEnd: true,
      usagePlanId: true,
      currency: true,
      overage: true,
      activeSubscriptionId: true,
      plan: {
        currency: true,
        pricePerOrder: true,
      },
    },
    first: 250,
  });

  let allShops = shops;

  while (shops.hasNextPage) {
    shops = await shops.nextPage();
    allShops = allShops.concat(shops);
  }

  const enqueueArray = [];

  for (const shop of allShops) {
    enqueueArray.push(
      async () =>
        await api.enqueue(
          api.chargeShop,
          {
            shop: {
              id: shop.id,
              currency: shop.currency,
              overage: shop.overage,
              activeSubscriptionId: shop.activeSubscriptionId,
              usagePlanId: shop.usagePlanId,
              plan: {
                currency: shop.plan.currency,
                price: shop.plan.pricePerOrder,
              },
            },
          },
          {
            queue: {
              name: shop.name,
              maxConcurrency: 4,
            },
          }
        )
    );

    await api.internal.shopifyShop.update(shop.id, {
      billingPeriodStart: DateTime.fromJSDate(new Date(shop.billingPeriodEnd))
        .plus({ milliseconds: 1 })
        .toJSDate(),
      billingPeriodEnd: DateTime.fromJSDate(new Date(shop.billingPeriodEnd))
        .plus({ days: 30 })
        .toJSDate(),
    });
  }
}

// Action timeout set to 5 minutes (300,000 milliseconds)
export const options = {
  timeoutMS: 900000,
  triggers: {
    api: true,
    scheduler: [{ cron: "*/5 * * * *" }],
  },
};
