import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import updateWishlistMetafield from "../../../utils/updateWishlistMetafield";

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
  // Update the wishlist metafield after creating a new wishlist item
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });

  const [variant, customer] = await Promise.all([
    api.shopifyProductVariant.findOne(record.variantId as string, {
      select: {
        inventoryQuantity: true,
        customersToEmail: true,
      },
    }),
    api.shopifyCustomer.findOne(record.customerId, {
      select: {
        email: true,
        emailMarketingConsent: true,
      },
    }),
  ]);

  // Check if the variant is out of stock
  if (!variant.inventoryQuantity && customer.emailMarketingConsent) {
    const customersToEmail = variant.customersToEmail as {
      [key: string]: string;
    };

    if (customer.email) {
      customersToEmail[record.customerId] = customer.email;
    }

    // Update the customersToEmail field for the variant
    await api.internal.shopifyProductVariant.update(
      record.variantId as string,
      {
        customersToEmail,
      }
    );
  }
};

export const options: ActionOptions = {
  actionType: "create",
};
