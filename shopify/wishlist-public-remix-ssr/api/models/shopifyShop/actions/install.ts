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

  // This namespace can be changed to anything you desire
  const namespace = "wishlist_app";

  let skip = false;

  if (process.env.NODE_ENV === "development") {
    const metafieldDefinitionsQueryResponse = await shopify.graphql(
      `
      query ($ownerType: MetafieldOwnerType!) {
        metafieldDefinitions(first: 250, ownerType: $ownerType) {
          nodes {
            id
            namespace
          }
        }
      }`,
      {
        ownerType: "CUSTOMER",
      }
    );

    for (const definition of metafieldDefinitionsQueryResponse
      .metafieldDefinitions.nodes) {
      if (definition.namespace === namespace) {
        record.wishlistMetafieldDefinitionId = definition.id;
        skip = true;
        break;
      }
    }
  }

  if (!skip) {
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
          namespace: namespace,
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
  }

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
