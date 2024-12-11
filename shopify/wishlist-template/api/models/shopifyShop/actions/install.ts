import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);

  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not found");

  // Create a metafield definition for wishlists to be used in the storefront
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

  record.wishlistMetafieldDefinitionId =
    res.metafieldDefinitionCreate.createdDefinition.id;

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Sync the shop data when the app is installed
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
};

export const options: ActionOptions = { actionType: "create" };
