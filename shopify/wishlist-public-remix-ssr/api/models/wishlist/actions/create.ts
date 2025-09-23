import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { updateMetafield } from "../../../utils/wishlist";

export const run: ActionRun = async ({
  params,
  record,
  session,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (!connections.shopify.currentAppProxy?.loggedInCustomerId)
    throw new Error("No customer on session");

  // @ts-ignore
  record.customer = {
    _link: connections.shopify.currentAppProxy?.loggedInCustomerId,
  };

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  if (!connections.shopify.currentAppProxy?.loggedInCustomerId)
    throw new Error("No customer on session");

  // Add a random image to the wishlist on creation. Might be good to give the user the option to upload their own image.
  await api.wishlist.update(record.id, {
    image: {
      copyURL: "https://picsum.photos/200",
    },
  });

  // Update the wishlist metafield to include the new wishlist
  await updateMetafield({
    // @ts-ignore
    shopId: record.shop,
    customerId: connections.shopify.currentAppProxy?.loggedInCustomerId,
  });
};

export const options: ActionOptions = {
  actionType: "create",
};
