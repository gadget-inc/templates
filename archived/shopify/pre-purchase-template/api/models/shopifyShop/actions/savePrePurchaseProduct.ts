import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";

// define a productId custom param for this action
export const params = {
  productId: { type: "string" },
};

export const run: ActionRun = async ({ params, record, logger, api }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  connections,
}) => {
  // get the product id passed in as a custom param
  const { productId } = params;

  // save the selected pre-purchase product in a SHOP-owned metafield
  // https://www.npmjs.com/package/shopify-api-node#metafields
  const response = await connections.shopify.current?.graphql(
    `mutation ($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          key
          namespace
          value
        }
        userErrors {
          message
        }
      }
    }`,
    {
      metafields: [
        {
          key: "pre-purchase-product",
          namespace: "gadget-tutorial",
          owner_id: `gid://shopify/Shop/${record.id}`,
          type: "product_reference",
          value: productId,
        },
      ],
    }
  );

  // just throw first error to client
  if (response?.metafieldsSet?.userErrors?.length)
    throw new Error(response?.metafieldsSet?.userErrors[0]?.message);

  // print to the Gadget Logs
  logger.info({ response }, "add metafields response");
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
