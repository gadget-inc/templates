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

  if (!shopify) throw new Error("Shopify connection is not available");

  const isBundleDefinition = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition){
        createdDefinition {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      definition: {
        key: "isBundle",
        type: "boolean",
        namespace: "bundle",
        name: "Boolean for marking a product varaint as the bundle parent variant",
        ownerType: "PRODUCTVARIANT",
      },
    }
  );

  if (isBundleDefinition.metafieldDefinitionCreate.userErrors.length) {
    logger.error(
      isBundleDefinition.metafieldDefinitionCreate.userErrors[0].message
    );
  }

  const componentReference = await shopify.graphql(
    `mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition){
        createdDefinition {
          id
        }
        userErrors {
          field
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

  if (componentReference.metafieldDefinitionCreate.userErrors.length) {
    logger.error(
      componentReference.metafieldDefinitionCreate.userErrors[0].message
    );
  }

  if (
    componentReference.metafieldDefinitionCreate?.createdDefinition?.id &&
    isBundleDefinition.metafieldDefinitionCreate?.createdDefinition?.id
  ) {
    await api.internal.shopifyShop.update(record.id, {
      bundleComponentsMetafieldDefinitionId:
        componentReference.metafieldDefinitionCreate.createdDefinition.id,
      isBundleDefinitionId:
        isBundleDefinition.metafieldDefinitionCreate.createdDefinition.id,
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
