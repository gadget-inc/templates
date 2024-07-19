import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shopify = connections.shopify.current;

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

  if (isBundleDefinition?.metafieldDefinitionCreate?.userErrors?.length)
    logger.error(
      isBundleDefinition.metafieldDefinitionCreate.userErrors[0].message
    );

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

  if (componentReference?.metafieldDefinitionCreate?.userErrors?.length)
    logger.error(
      componentReference.metafieldDefinitionCreate.userErrors[0].message
    );

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

  if (
    bundleComponentQuantitiesDefinition?.metafieldDefinitionCreate?.userErrors
      ?.length
  )
    logger.error(
      bundleComponentQuantitiesDefinition.metafieldDefinitionCreate
        .userErrors[0].message
    );

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

  const cartTransformCreateResponse = await shopify.graphql(`
    mutation {
      cartTransformCreate(functionId: "${process.env.BUNDLER_FUNCTION_ID}") {
        userErrors {
          message
        }
      }
    }`);

  if (cartTransformCreateResponse?.cartTransformCreate?.userErrors?.length)
    logger.error(
      cartTransformCreateResponse.cartTransformCreate.userErrors[0].message
    );

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

  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: false },
};
