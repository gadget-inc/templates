import {
  applyParams,
  save,
  ActionOptions,
  InstallShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  const shopify = connections.shopify.current;

  const res = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
        }
        userErrors {
          message
        }
      }
    }`,
    {
      definition: {
        name: "Wishlists",
        namespace: "wishlist_app",
        key: "wishlists",
        description: "A list of wishlists",
        type: "json",
        ownerType: "CUSTOMER",
      },
    }
  );

  if (res?.metafieldDefinitionCreate?.userErrors?.length)
    throw new Error(res.metafieldDefinitionCreate.userErrors[0].message);

  (record.wishlistMetafieldDefinitionId =
    res.metafieldDefinitionCreate.createdDefinition.id),
    await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
}

/** @type { ActionOptions } */
export const options = { actionType: "create" };
