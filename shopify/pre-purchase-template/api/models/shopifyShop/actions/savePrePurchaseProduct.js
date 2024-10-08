import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SavePrePurchaseProductShopifyShopActionContext,
} from "gadget-server";

// define a productId custom param for this action
export const params = {
  productId: { type: "string" },
};

/**
 * @param { SavePrePurchaseProductShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { SavePrePurchaseProductShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, connections }) {
  // get the product id passed in as a custom param
  const { productId } = params;

  // save the selected pre-purchase product in a SHOP-owned metafield
  // https://www.npmjs.com/package/shopify-api-node#metafields
  const response = await connections.shopify.current?.metafield.create({
    key: "pre-purchase-product",
    namespace: "gadget-tutorial",
    owner_id: record.id,
    type: "product_reference",
    value: productId,
  });

  // just throw first error to clint
  if (response?.metafieldsSet?.userErrors?.length) {
    throw new Error(
      response?.metafieldsSet?.userErrors[0]?.message
    );
  }

  // print to the Gadget Logs
  logger.info({ response }, "add metafields response");
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};
