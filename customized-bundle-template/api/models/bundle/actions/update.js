import {
  applyParams,
  save,
  ActionOptions,
  UpdateBundleActionContext,
} from "gadget-server";

/**
 * @param { UpdateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  if (record.changed("title")) {
    record.titleLowercase = title.toLowerCase();
  }

  const shopify = connections.shopify.current;

  const variants = await api.bundleComponent.findMany({
    filter: {
      bundleId: {
        equals: record.id,
      },
    },
    first: 250,
    select: {
      id: true,
    },
  });

  const variantGIDArray = [];

  for (const variant of variants) {
    variantGIDArray.push(`gid://shopify/ProductVariant/${variant.id}`);
  }

  // Will actually need to change this logic to update the product and variant in Shopify

  const res = await shopify.graphql(
    `mutation($productInput: ProductInput!) {
      productUpdate(input: $productInput) {
        product {
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      productInput: {
        status: record.status.toUpperCase(),
        title: record.title,
        variants: [
          {
            requiresComponents: true,
            metafields: [
              {
                namespace: "bundle",
                key: "componentReference",
                type: "list.variant_reference",
                value: JSON.stringify(variantGIDArray),
              },
            ],
          },
        ],
      },
    }
  );

  if (res?.metafieldsSet?.userErrors?.length)
    throw new Error(res.metafieldsSet.userErrors[0].message);

  await save(record);
}

/**
 * @param { UpdateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
