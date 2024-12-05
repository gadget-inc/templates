import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const changes = record.changes("inventoryQuantity");

  // If the inventory quantity has changed and the variant is now in stock
  if (changes.changed && !changes.previous) {
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
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: "update" };
