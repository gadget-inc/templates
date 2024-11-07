import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { DateTime } from "luxon";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  // Fetch the shop to get the default update frequency
  const shop = await api.shopifyShop.maybeFindOne(record.shopId as string, {
    select: {
      defaultUpdateFrequency: true,
    },
  });

  let date;

  // Set the date for the next update based on the default update frequency
  switch (shop?.defaultUpdateFrequency) {
    case "weekly":
      date = DateTime.fromJSDate(new Date()).plus({ weeks: 1 }).toJSDate();
      break;
    case "monthly":
      date = DateTime.fromJSDate(new Date()).plus({ months: 1 }).toJSDate();
      break;
    case "quarterly":
      date = DateTime.fromJSDate(new Date()).plus({ months: 3 }).toJSDate();
      break;
    default:
      break;
  }

  record.sendUpdateAt = date as Date;

  await save(record);
};

/**
 * @param { CreateShopifyCustomerActionContext } context
 */
export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: "create" };
