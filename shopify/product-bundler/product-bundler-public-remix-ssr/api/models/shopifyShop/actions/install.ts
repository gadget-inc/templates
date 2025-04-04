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
  const updateObj: {
    onlineStorePublicationId?: string;
    componentReferenceDefinitionId?: string;
    isBundleDefinitionId?: string;
    bundleComponentQuantitiesDefinitionId?: string;
  } = {};

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
  if (isBundleDefinition?.metafieldDefinitionCreate?.userErrors?.length) {
    logger.error(
      isBundleDefinition.metafieldDefinitionCreate.userErrors[0].message
    );
  } else {
    updateObj["isBundleDefinitionId"] =
      isBundleDefinition.metafieldDefinitionCreate.createdDefinition.id;
  }

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
  if (componentReference?.metafieldDefinitionCreate?.userErrors?.length) {
    logger.error(
      componentReference.metafieldDefinitionCreate.userErrors[0].message
    );
  } else {
    updateObj["componentReferenceDefinitionId"] =
      componentReference.metafieldDefinitionCreate.createdDefinition.id;
  }

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
  ) {
    logger.error(
      bundleComponentQuantitiesDefinition.metafieldDefinitionCreate
        .userErrors[0].message
    );
  } else {
    updateObj["bundleComponentQuantitiesDefinitionId"] =
      bundleComponentQuantitiesDefinition.metafieldDefinitionCreate.createdDefinition.id;
  }

  // Query for the store's publications to retrieve the online store publication id
  const publicationsResponse = await shopify.graphql(
    `query {
      publications(first: 250) {
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
      updateObj["onlineStorePublicationId"] = id;
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

  if (Object.entries(updateObj).length) {
    logger.info("Updating Shopify shop with metafield definitions");
    await api.internal.shopifyShop.update(record.id, updateObj);
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
