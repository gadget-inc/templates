import { ActionOptions } from "gadget-server";
import { DateTime } from "luxon";

/**
 * Features of this global action:
 * - Runs on a cron trigger (schedule) every 5 minutes
 * - Paginating to fetch all shops where the billingPeriodEnd date has passed
 * - Creates a usage charge for previous billing period overages
 * - Sets the shop billing period information to track the next period
 */
export const run: ActionRun = async ({ params, logger, api, connections }) => {
  let shops = await api.shopifyShop.findMany({
    filter: {
      billingPeriodEnd: {
        lessThanOrEqual: new Date(),
      },
      state: {
        inState: "installed",
      },
      planId: {
        isSet: true,
      },
    },
    select: {
      id: true,
      name: true,
      billingPeriodEnd: true,
      usagePlanId: true,
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
    allShops.push(...shops);
  }

  for (const shop of allShops) {
    if (!shop.name) continue;

    await api.enqueue(
      api.chargeShop,
      {
        shop: {
          id: shop.id,
          overage: shop.overage,
          activeSubscriptionId: shop.activeSubscriptionId,
          usagePlanId: shop.usagePlanId,
          plan: {
            price: shop?.plan?.pricePerOrder ?? 0,
            currency: shop?.plan?.currency ?? "CAD",
          },
        },
      },
      {
        queue: {
          name: shop.name,
          maxConcurrency: 4,
        },
        retries: 1,
      }
    );

    // Updating billing period information
    await api.internal.shopifyShop.update(shop.id, {
      billingPeriodStart: DateTime.fromJSDate(
        new Date(shop.billingPeriodEnd ?? new Date())
      )
        .plus({ milliseconds: 1 })
        .toJSDate(),
      billingPeriodEnd: DateTime.fromJSDate(
        new Date(shop.billingPeriodEnd ?? new Date())
      )
        .plus({ days: 30 })
        .toJSDate(),
    });
  }
};

export const options: ActionOptions = {
  timeoutMS: 900000,
  triggers: {
    api: true,
    scheduler: [{ cron: "*/5 * * * *" }],
  },
};
