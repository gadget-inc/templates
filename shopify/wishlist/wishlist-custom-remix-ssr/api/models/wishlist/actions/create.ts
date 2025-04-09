import {
  applyParams,
  save,
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
  // Add a random image to the wishlist on creation. Might be good to give the user the option to upload their own image.

  await api.wishlist.update(record.id, {
    image: {
      copyURL: "https://picsum.photos/200",
    },
  });

  // Update the wishlist metafield to include the new wishlist
  await updateWishlistMetafield({
    // @ts-ignore
    shopId: record.shop,
    customerId: record.customerId,
  });
};

export const options: ActionOptions = {
  actionType: "create",
};
