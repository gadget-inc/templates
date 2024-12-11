import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

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
  // Delete the customer's wishlist data when the customer is deleted
  await Promise.all([
    api.internal.wishlist.deleteMany({
      filter: {
        customerId: {
          equals: record.id,
        },
      },
    }),
    api.internal.wishlistItem.deleteMany({
      filter: {
        customerId: {
          equals: record.id,
        },
      },
    }),
  ]);
};

export const options: ActionOptions = { actionType: "delete" };
