import {
  applyParams,
  save,
  ActionOptions,
  CreateShopifyCustomerActionContext,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

/**
 * @param { CreateShopifyCustomerActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyCustomerActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const wishlist = await api.wishlist.maybeFindFirst({
    filter: {
      customer: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!wishlist) {
    await api.internal.wishlist.upsert({
      customer: {
        _link: record.id,
      },
      on: ["customer"],
    });
  }
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };
