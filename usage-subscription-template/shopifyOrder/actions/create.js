import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyOrderActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      inTrial: true,
      paused: true,
    },
  });

  if (shop && (shop?.inTrial || !shop?.paused)) {
    await save(record);
  }
}

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      inTrial: true,
      paused: true,
      usagePlanId: true,
      currency: true,
      plan: {
        pricePerOrder: true,
        currency: true,
      },
    },
  });

  if (shop && !shop?.inTrial && !shop?.paused) {
    let price = 0;

    // Calculation of pricePerOrder with shop currency might be better done once and saved in the database as a custom field on shopifyShop
    if (shop?.plan.pricePerOrder) {
      const currencyConverter = new CurrencyConverter();
      // Get cost of plan for current shop based on the plan currency
      price = await currencyConverter
        .from(shop.plan.currency)
        .to(shop.currency)
        .convert(shop.plan.pricePerOrder);
    }

    const result = await connections.shopify.current.graphql(`
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

    // Change this to the "freeze functionality" flow
    if (result?.appUsageRecordCreate.userErrors.length) {
      throw new Error(
        result?.appUsageRecordCreate?.userErrors[0]?.message ||
          "FAILED USAGE CHARGE CREATION - Error creating app usage record (SHOPIFY API)"
      );
    }
  } // Add logic to send an email if the person needs to up their cap (make sure to make a field to track if the email has been sent)
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
