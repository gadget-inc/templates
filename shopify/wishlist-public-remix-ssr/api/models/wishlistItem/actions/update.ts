import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { updateMetafield } from "../../../utils/wishlist";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Update the wishlist metafield after updating a wishlist
  await updateMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
};

export const options: ActionOptions = {
  actionType: "update",
};
