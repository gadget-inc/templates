import { BillingPeriodTrackingGlobalActionContext } from "gadget-server";
import { DateTime } from "luxon";
import { getCappedAmount } from "../utilities";

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
    },
    select: {
      id: true,
      billingPeriodEnd: true,
      usagePlanId: true,
      currency: true,
      overage: true,
      activeSubscriptionId: true,
      plan: {
        currency: true,
      },
    },
    first: 250,
  });

  let allShops = shops;

  while (shops.hasNextPage) {
    shops = await shops.nextPage();
    allShops = allShops.concat(shops);
  }

  for (const shop of allShops) {
    let remainder = 0;

    if (shop.overage) {
      const shopify = await connections.shopify.forShopId(shop.id);

      const activeSubscription = await api.shopifyAppSubscription.maybeFindOne(
        shop.activeSubscriptionId,
        {
          select: {
            lineItems: true,
          },
        }
      );

      if (!activeSubscription) {
        logger.warn(
          logger.warn({
            message:
              "NO ACTIVE SUBSCRIPTION - Cannot charge overages because the shop has no active subscription",
            shopId: shop.id,
            in: "billingPeriodTracking.js",
          })
        );
      }

      const cappedAmount = getCappedAmount(activeSubscription);

      if (!cappedAmount) {
        logger.warn({
          message:
            "NO CAPPED AMOUNT - Active subscription missing a capped amount",
          shopId: shop.id,
          in: "billingPeriodTracking.js",
        });
        continue;
      }

      let price = shop.overage;

      if (price > cappedAmount) {
        remainder = price - cappedAmount;
        price = cappedAmount;
      }

      const result = await shopify.graphql(`
        mutation {
          appUsageRecordCreate(
            description: "Charge of ${price} ${shop.currency} for overages from the previous billing period",
            price: {
              amount: ${price},
              currencyCode: ${shop.currency},
            },
            subscriptionLineItemId: "${shop.usagePlanId}") {
            appUsageRecord {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `);

      if (result?.appUsageRecordCreate.userErrors.length) {
        logger.error({
          message:
            result?.appUsageRecordCreate?.userErrors[0]?.message ||
            `FAILED USAGE CHARGE CREATION - Error creating app usage record (SHOPIFY API)`,
          shopId: shop.id,
          in: "billingPeriodTracking.js",
        });
      }
    }

    await api.internal.shopifyShop.update(shop.id, {
      billingPeriodStart: DateTime.fromJSDate(new Date(shop.billingPeriodEnd))
        .plus({ milliseconds: 1 })
        .toJSDate(),
      billingPeriodEnd: DateTime.fromJSDate(new Date(shop.billingPeriodEnd))
        .plus({ days: 30 })
        .toJSDate(),
      overage: remainder,
    });
  }
}

// Action timeout set to 5 minutes (300,000 milliseconds)
export const options = {
  timeoutMS: 300000,
};
