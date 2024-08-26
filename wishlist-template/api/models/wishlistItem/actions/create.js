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
  // Update the wishlist metafield after creating a new wishlist item
  await updateWishlistMetafield({
    shopId: record.shopId,
    customerId: record.customerId,
  });

  const [variant, customer] = await Promise.all([
    api.shopifyProductVariant.findOne(record.variantId, {
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
    const customersToEmail = variant.customersToEmail;

    customersToEmail[record.customerId] = customer.email;

    // Update the customersToEmail field for the variant
    await api.internal.shopifyProductVariant.update(record.variantId, {
      customersToEmail,
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
