import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
} from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not established");

  // Create metafield definition for product variants that represent a bundle
  const isBundleDefinition = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition){
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
        key: "isBundle",
        type: "boolean",
        namespace: "bundle",
        name: "Is the bundle's parent variant? Used in app logic",
        ownerType: "PRODUCTVARIANT",
      },
    }
  );

  // Throw an error if the definition creation failed
  if (isBundleDefinition?.metafieldDefinitionCreate?.userErrors?.length)
    logger.error(
      isBundleDefinition.metafieldDefinitionCreate.userErrors[0].message
    );

  // Create metafield definition for product variants that are part of the bundle
  const componentReference = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition){
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
        key: "componentReference",
        type: "list.variant_reference",
        namespace: "bundle",
        name: "Bundle component reference",
        ownerType: "PRODUCTVARIANT",
      },
    }
  );

  // Throw an error if the definition creation failed
  if (componentReference?.metafieldDefinitionCreate?.userErrors?.length)
    logger.error(
      componentReference.metafieldDefinitionCreate.userErrors[0].message
    );

  // Create metafield definition for defining the quantities of each product variant in a bundle
  const bundleComponentQuantitiesDefinition = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition){
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
        key: "productVariantQuantities",
        type: "json",
        namespace: "bundle",
        name: "Product variant quantities",
        ownerType: "PRODUCTVARIANT",
      },
    }
  );

  // Throw an error if the definition creation failed
  if (
    bundleComponentQuantitiesDefinition?.metafieldDefinitionCreate?.userErrors
      ?.length
  )
    logger.error(
      bundleComponentQuantitiesDefinition.metafieldDefinitionCreate
        .userErrors[0].message
    );

  // Query for the store's publications to retrieve the online store publication id
  const publicationsResponse = await shopify.graphql(
    `query {
      publications(first: 10) {
        edges {
          node {
            id
            name
            supportsFuturePublishing
            app {
              id
              title
              description
              developerName
            }
          }
        }
      }
    }`
  );

  let onlineStorePublicationId;

  // Find the online store publication id (add pagination if there are more than 10 publications)
  for (const {
    node: {
      id,
      name,
      app: { developerName, title },
    },
  } of publicationsResponse.publications.edges) {
    if (
      name === "Online Store" &&
      title === "Online Store" &&
      developerName === "Shopify"
    ) {
      onlineStorePublicationId = id;
      break;
    }
  }

  // Create the cart transform function on this store. See the setup steps for more information on how to get the functionId
  const cartTransformCreateResponse = await shopify.graphql(`
    mutation {
      cartTransformCreate(functionId: "${process.env.BUNDLER_FUNCTION_ID}") {
        userErrors {
          message
        }
      }
    }`);

  // Throw an error if the cart transform creation failed
  if (cartTransformCreateResponse?.cartTransformCreate?.userErrors?.length)
    logger.error(
      cartTransformCreateResponse.cartTransformCreate.userErrors[0].message
    );

  // If all worked as it should, update the shop record with the ids returned from each call
  if (
    componentReference.metafieldDefinitionCreate?.createdDefinition?.id &&
    isBundleDefinition.metafieldDefinitionCreate?.createdDefinition?.id &&
    bundleComponentQuantitiesDefinition.metafieldDefinitionCreate
      ?.createdDefinition?.id
  ) {
    await api.internal.shopifyShop.update(record.id, {
      componentReferenceDefinitionId:
        componentReference.metafieldDefinitionCreate.createdDefinition.id,
      isBundleDefinitionId:
        isBundleDefinition.metafieldDefinitionCreate.createdDefinition.id,
      bundleComponentQuantitiesDefinitionId:
        bundleComponentQuantitiesDefinition.metafieldDefinitionCreate
          .createdDefinition.id,
      onlineStorePublicationId,
    });
  }

  // Run a sync to fetch all products data
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: false },
};
