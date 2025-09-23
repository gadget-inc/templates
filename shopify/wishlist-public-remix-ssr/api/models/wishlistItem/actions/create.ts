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

  const customerId = connections.shopify.currentAppProxy?.loggedInCustomerId;

  if (!customerId) throw new Error("No customer on session");

  // @ts-ignore
  record.customer = {
    _link: customerId,
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
  const customerId = connections.shopify.currentAppProxy?.loggedInCustomerId;

  if (!customerId) throw new Error("No customer on session");

  // Update the wishlist metafield after creating a new wishlist item
  await updateMetafield({
    // @ts-ignore
    shopId: record.shop,
    customerId,
  });

  const [variant, customer] = await Promise.all([
    api.shopifyProductVariant.findOne(record.variantId as string, {
      select: {
        inventoryQuantity: true,
        customersToEmail: true,
      },
    }),
    api.shopifyCustomer.findOne(customerId, {
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
      customersToEmail[customerId] = customer.email;
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
