import { ActionOptions } from "gadget-server";
import { getCappedAmount } from "../../utilities";
import type { SubscriptionLineItems } from "../models/shopifyShop/actions/subscribe";

export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const {
    shop,
    order,
  }: {
    shop?: {
      id?: string;
      overage?: number;
      activeSubscriptionId?: string;
      usagePlanId?: string;
      plan?: {
        price?: number;
        currency?: string;
      };
    };
    order?: {
      email?: string;
    };
  } = params;

  if (!shop || !shop.id || !shop.activeSubscriptionId)
    throw new Error("Missing required shop data");

  // Creating an instance of the Shopify Admin API
  const shopify = await connections.shopify.forShopId(shop?.id);

  // Returning early if the shop is uninstalled and no Shopify instance is created
  if (!shopify)
    return logger.warn({
      message: "BILLING - Shop uninstalled",
      shopId: shop?.id,
    });

  // Fetching the amount used in the period
  const { amountUsedInPeriod } = await api.shopifyShop.findOne(shop?.id, {
    select: {
      amountUsedInPeriod: true,
    },
  });

  let remainder = 0;

  // Fetching the subscription at the time
  const subscription = await api.shopifyAppSubscription.maybeFindOne(
    shop?.activeSubscriptionId,
    {
      select: {
        lineItems: true,
      },
    }
  );

  if (!subscription)
    return logger.warn({
      message: "BILLING - No subscription found for the shop",
      shopId: shop?.id,
    });

  // Pulling out the capped amount from the active subscription
  const cappedAmount = getCappedAmount(
    subscription.lineItems as SubscriptionLineItems
  );

  if (!cappedAmount)
    return logger.warn({
      message: "BILLING - No capped amount found for the shop",
      shopId: shop?.id,
    });

  // Initially setting the price to the plan price and adding the overage amount if they exist
  let price = shop?.plan?.price ?? 0 + (shop?.overage ?? 0);

  // Returning early if the amount used in the period is greater than or equal to the capped amount
  if (amountUsedInPeriod && (amountUsedInPeriod as number) >= cappedAmount) {
    // Modifying the overage amount of the current shop
    return await api.internal.shopifyShop.update(shop?.id, {
      overage: price,
    });
  }

  // Calculating the available amount
  const availableAmount = cappedAmount - ((amountUsedInPeriod as number) ?? 0);

  // Setting a remainder if the price is greater than the available amount
  if (price >= availableAmount) {
    remainder = price - availableAmount;
    price = availableAmount;
  }

  // Creating the usage charge with the Shopify Billing API
  const result = await shopify.graphql(
    `mutation ($description: String!, $price: MoneyInput!, $subscriptionLineItemId: ID!) {
      appUsageRecordCreate(description: $description, price: $price, subscriptionLineItemId: $subscriptionLineItemId) {
        appUsageRecord {
          id
        }
        userErrors {
          message
        }
      }
    }`,
    {
      description: shop?.overage
        ? `Charge of ${price} ${shop?.plan?.currency} ${
            order?.email ? `for order placed by ${order?.email}` : ""
          }, with overages from the previous billing period`
        : `Charge of ${price} ${shop?.plan?.currency} for order placed by ${order?.email}`,
      price: {
        amount: price,
        currencyCode: shop?.plan?.currency,
      },
      subscriptionLineItemId: shop?.usagePlanId,
    }
  );

  // Throwing an error if the charge fails
  if (result?.appUsageRecordCreate?.userErrors?.length)
    throw new Error(result.appUsageRecordCreate.userErrors[0].message);

  // Creating the usage charge record in the database
  await api.internal.usageRecord.create({
    id: result.appUsageRecordCreate.appUsageRecord.id.split("/")[4],
    price,
    currency: shop?.plan?.currency,
    shop: {
      _link: shop?.id,
    },
  });

  // Updating the overage amount if there is a remainder
  if (remainder)
    await api.internal.shopifyShop.update(shop?.id, {
      overage: remainder,
    });
};

export const options: ActionOptions = {};

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
      overage: {
        type: "number",
      },
      plan: {
        type: "object",
        properties: {
          price: {
            type: "number",
          },
          currency: {
            type: "string",
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
