import {
  deleteRecord,
  ActionOptions,
} from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { updateWishlistMetafield } from "../../../utils";

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
  // Delete all wishlist items associated with the wishlist
  await api.internal.wishlistItem.deleteMany({
    filter: {
      wishlistId: {
        equals: record.id,
      },
    },
  });

  // Update the wishlist metafield
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });
};

export const options: ActionOptions = {
  actionType: "delete",
};
