import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyOrderActionContext,
} from "gadget-server";
import CurrencyConverter from "currency-converter-lt";
import { getCappedAmount } from "../../../../utilities";

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      id: true,
      inTrial: true,
      usagePlanId: true,
      currency: true,
      overage: true,
      amountUsedInPeriod: true,
      plan: {
        pricePerOrder: true,
        currency: true,
      },
    },
  });

  if (shop && !shop?.inTrial) {
    let price = 0;

    // Calculation of pricePerOrder with shop currency might be better done once and saved in the database as a custom field on shopifyShop
    if (shop.plan.pricePerOrder) {
      const currencyConverter = new CurrencyConverter();

      if (record.currency !== shop.plan.currency) {
        // Get cost of plan for current shop based on the plan currency
        price = await currencyConverter
          .from(record.currency)
          .to(shop.currency)
          .convert(shop.plan.pricePerOrder);
      } else {
        price = shop.plan.pricePerOrder;
      }
    }

    // Use this same logic in app subscription update (Slightly modified to work only for overages)
    if (!shop.overage) {
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

      if (result?.appUsageRecordCreate.userErrors.length) {
        let exceedsCappedAmount = false;

        for (const error of result.appUsageRecordCreate.userErrors) {
          if (error.message == "Total price exceeds balance remaining") {
            exceedsCappedAmount = true;
            break;
          }
        }

        if (!exceedsCappedAmount) {
          throw new Error(
            result?.appUsageRecordCreate?.userErrors[0]?.message ||
              "FAILED USAGE CHARGE CREATION - Error creating app usage record (SHOPIFY API)"
          );
        }

        const activeSubscription = await api.shopifyAppSubscription.findFirst({
          filter: {
            shop: {
              equals: record.shopId,
            },
            status: {
              equals: "ACTIVE",
            },
          },
          select: {
            lineItems: true,
          },
        });

        if (!activeSubscription) {
          throw new Error(
            "NO ACTIVE SUBSCRIPTION - the shop has no active subscription"
          );
        }

        const cappedAmount = getCappedAmount(activeSubscription);

        const amountUsedInPeriod = shop?.amountUsedInPeriod || 0;

        const remainder = price - (cappedAmount - amountUsedInPeriod);
        price = cappedAmount - amountUsedInPeriod;

        await connections.shopify.current.graphql(`
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

        await api.internal.shopifyShop.update(record.shopId, {
          overage: remainder,
          usageRecords: [
            {
              create: {
                currency: shop.currency,
                price,
              },
            },
          ],
        });
      } else {
        /**
         * This usageRecord model is not the usage record model from Shopify.
         * The shopifyUsageRecord model requires that you sync to get the latest data.
         */
        await api.usageRecord.create({
          price,
          currency: shop.currency,
          shop: {
            _link: shop.id,
          },
        });
      }
    } else {
      await api.internal.shopifyShop.update(shop.id, {
        overage: overage + price,
      });
    }
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: false },
};
