import {
  applyParams,
  save,
  ActionOptions,
  UpdateShopifyProductVariantActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { UpdateShopifyProductVariantActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const { changed, previous } = record.changes("inventoryQuantity");

  // If the inventory quantity has changed and the variant is now in stock
  if (changed && !previous) {
    const { customersToEmail } = record;

    const customers = Object.values(customersToEmail);

    // If there are customers to email
    if (customers.length) {
      // Send emails to the customers
      await api.enqueue(api.sendInStockEmails, {
        customers,
        variant: {
          title: record.title,
          id: record.id,
        },
        shopId: record.shopId,
        productId: record.productId,
      });

      // Update the customersToEmail field for the variant
      record.customersToEmail = {};
    }
  }

  await save(record);
}

/**
 * @param { UpdateShopifyProductVariantActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = { actionType: "update" };
