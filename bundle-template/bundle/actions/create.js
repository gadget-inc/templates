import { applyParams, save, ActionOptions, CreateBundleActionContext } from "gadget-server";

/**
 * @param { CreateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  const shopify = connections.shopify.current

  if (shopify) {
    const { variants } = params;

    const bundleProduct = await shopify.product.create({
      title,
      variants: [
        {
          price: record.price.toString(),
        }
      ]
    });

    const bundleVariants = []

    for (const variant of variants) {
      bundleVariants.push({
        id: variant.id,
        quantity: variant.quantity
      })

      record.quantities[`${variant.id}`] = variant.quantity;
    }

    const response = await shopify.graphql(
      `mutation ($input: [ProductVariantRelationshipUpdateInput!]!) {
        productVariantRelationshipBulkUpdate(input: $input) {
          parentProductVariants {
            id
            productVariantComponents(first: 10) {
              nodes{
                id
                quantity
                productVariant {
                  id
                }
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }`,
      {
        input: [
          {
            parentProductVariantId: `gid://shopify/ProductVariant/${bundleProduct.variants[0].id}`,
            productVariantRelationshipsToCreate: bundleVariants
          }
        ]
      }
    );

    if (response.productVariantRelationshipBulkUpdate.userErrors.length) {
      await shopify.product.delete(bundleProduct.product.id)

      throw new Error(response.productVariantRelationshipBulkUpdate.userErrors[0].message)
    } else {
      await save(record);
    }
  } else {
    throw new Error("Shopify client undefined - Must have shopify shop context.")
  }
};

/**
 * @param { CreateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};

export const params = {
  variants: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" }
      }
    }
  }
}
