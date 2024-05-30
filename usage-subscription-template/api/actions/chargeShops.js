import { ActionOptions, ChargeShopGlobalActionContext } from "gadget-server";
import { getCappedAmount } from "../../utilities";

/**
 * @param { ChargeShopGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const { shop, order } = params;

  const { amountUsedInPeriod } = await api.shopifyShop.findOne(shop.id, {
    amountUsedInPeriod: true,
  });

  let remainder = 0;

  const shopify = await connections.shopify.forShopId(shop.id);

  const activeSubscription = await api.shopifyAppSubscription.maybeFindOne(
    shop?.activeSubscriptionId,
    {
      select: {
        lineItems: true,
      },
    }
  );

  if (!activeSubscription) {
    logger.warn({
      message:
        "NO ACTIVE SUBSCRIPTION - Cannot charge overages because the shop has no active subscription",
      shopId: shop.id,
      in: "billingPeriodTracking.js",
    });
    return;
  }

  const cappedAmount = getCappedAmount(activeSubscription);

  if (!cappedAmount) {
    logger.warn({
      message: "NO CAPPED AMOUNT - Active subscription missing a capped amount",
      shopId: shop.id,
      in: "billingPeriodTracking.js",
    });
    return;
  }

  let price = shop.plan?.price || 0;

  if (shop.overage) {
    price += shop.overage;
  }

  if (amountUsedInPeriod === cappedAmount) {
    remainder = price;
    return await api.internal.shopifyShop.update(shop.id, {
      overage: remainder,
    });
  }

  if (price > cappedAmount - amountUsedInPeriod) {
    remainder = price - (cappedAmount - amountUsedInPeriod);
    price = cappedAmount - amountUsedInPeriod;
  }

  const result = await shopify.graphql(
    `mutation ($description: String!, $price: MoneyInput!, $subscriptionLineItemId: ID!) {
      appUsageRecordCreate(description: $description, price: $price, subscriptionLineItemId: $subscriptionLineItemId) {
        appUsageRecord {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      description: shop.overage
        ? `Charge of ${price} ${shop.currency} ${
            order.email ? `for order placed by ${order.email}` : ""
          }, with overages from the previous billing period`
        : `Charge of ${price} ${shop.currency} for order placed by ${order.email}`,
      price: {
        amount: price,
        currencyCode: shop.currency,
      },
      subscriptionLineItemId: shop.usagePlanId,
    }
  );

  if (result?.appUsageRecordCreate.userErrors.length)
    throw new Error(result.appUsageRecordCreate.userErrors[0].message);

  await api.internal.usageRecord.create({
    id: result.appUsageRecordCreate.appUsageRecord.id.split("/")[4],
    price,
    currency: shop.currency,
    shop: {
      _link: shop.id,
    },
  });

  if (remainder) {
    await api.internal.shopifyShop.update(shop.id, {
      overage: remainder,
    });
  }
}

/** @type { ActionOptions } */
export const options = {};

export const params = {
  shop: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      activeSubscriptionId: {
        type: "string",
      },
      usagePlanId: {
        type: "string",
      },
      currency: {
        type: "string",
      },
      overage: {
        type: "number",
      },
      plan: {
        type: "object",
        properties: {
          price: {
            type: "number",
          },
        },
      },
    },
  },
  order: {
    type: "object",
    properties: {
      email: {
        type: "string",
      },
    },
  },
};
