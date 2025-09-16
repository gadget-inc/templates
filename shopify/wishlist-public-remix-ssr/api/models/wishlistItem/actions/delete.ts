import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { metafieldUpdate } from "../../../utils/wishlist";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Update the wishlist metafield after deleting a wishlist item
  await metafieldUpdate({
    shopId: record.shopId,
    customerId: record.customerId,
  });
};

export const options: ActionOptions = {
  actionType: "delete",
};
