import {
  applyParams,
  save,
  ActionOptions,
  CreateWishlistItemActionContext,
} from "gadget-server";
import { updateWishlistMetafield } from "../../../utilities";

/**
 * @param { CreateWishlistItemActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateWishlistItemActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
