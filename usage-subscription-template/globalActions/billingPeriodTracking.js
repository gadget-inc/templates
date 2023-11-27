import { BillingPeriodTrackingGlobalActionContext } from "gadget-server";

/**
 * @param { BillingPeriodTrackingGlobalActionContext } context
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

      let cappedAmount = 0;

      if (activeSubscription) {
        for (const lineItem of activeSubscription.lineItems) {
          if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
            cappedAmount = parseFloat(
              lineItem.plan.pricingDetails.cappedAmount.amount
            );
            break;
          }
        }
      }

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
            description: "Charge of ${price} ${shop.currency}",
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
      billingPeriodEnd: DateTime.fromJSDate(new Date(record.currentPeriodEnd))
        .plus({ days: 30 })
        .toJSDate(),
      overage: remainder,
    });
  }
}
