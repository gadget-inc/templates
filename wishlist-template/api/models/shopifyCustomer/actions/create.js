import {
  applyParams,
  save,
  ActionOptions,
  CreateShopifyCustomerActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { DateTime } from "luxon";

/**
 * @param { CreateShopifyCustomerActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
    select: {
      defaultUpdateFrequency: true,
    },
  });

  let date;

  switch (shop.defaultUpdateFrequency) {
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

  record.sendUpdateAt = date;

  await save(record);
}

/**
 * @param { CreateShopifyCustomerActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };
