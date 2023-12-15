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
  // https://shopify.dev/docs/api/admin-graphql/2023-10/mutations/metafieldsset
  const response = await connections.shopify.current?.graphql(
    `mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
          ownerType
          key
          namespace
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      metafields: [
        {
          key: "pre-purchase-product",
          namespace: "gadget-tutorial",
          ownerId: `gid://shopify/Shop/${record.id}`,
          type: "product_reference",
          value: productId,
        },
      ],
    }
  );

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
};
