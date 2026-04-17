import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not established");

  const updatePayload: Record<string, string> = {};

  const createDefinition = async (definition: Record<string, unknown>, targetField: string) => {
    const responseHandle = await api.enqueue(shopify.graphql, {
      query: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
          }
          userErrors {
            message
          }
        }
      }`,
      variables: { definition },
    });

    const response = (await responseHandle.result()) as {
      metafieldDefinitionCreate?: {
        createdDefinition?: { id?: string };
        userErrors?: { message: string }[];
      };
    };

    if (response?.metafieldDefinitionCreate?.userErrors?.length) {
      logger.error(response.metafieldDefinitionCreate.userErrors[0].message);
      return;
    }

    const id = response?.metafieldDefinitionCreate?.createdDefinition?.id;

    if (id) updatePayload[targetField] = id;
  };

  await createDefinition(
    {
      key: "isBundle",
      type: "boolean",
      namespace: "bundle",
      name: "Is bundle variant",
      ownerType: "PRODUCTVARIANT",
    },
    "isBundleDefinitionId"
  );

  await createDefinition(
    {
      key: "componentReference",
      type: "list.variant_reference",
      namespace: "bundle",
      name: "Bundle component reference",
      ownerType: "PRODUCTVARIANT",
    },
    "componentReferenceDefinitionId"
  );

  await createDefinition(
    {
      key: "productVariantQuantities",
      type: "json",
      namespace: "bundle",
      name: "Bundle component quantities",
      ownerType: "PRODUCTVARIANT",
    },
    "bundleComponentQuantitiesDefinitionId"
  );

  const publicationsResponse = await shopify.graphql(
    `query GetPublications {
      publications(first: 250) {
        edges {
          node {
            id
            name
            app {
              title
              developerName
            }
          }
        }
      }
    }`
  );

  for (const publication of publicationsResponse?.publications?.edges ?? []) {
    const node = publication.node;
    if (
      node?.name === "Online Store" &&
      node?.app?.title === "Online Store" &&
      node?.app?.developerName === "Shopify"
    ) {
      updatePayload.onlineStorePublicationId = node.id;
      break;
    }
  }

  const cartTransformHandle = await api.enqueue(shopify.graphql, {
    query: `mutation CreateCartTransform($functionHandle: String!) {
      cartTransformCreate(functionHandle: $functionHandle) {
        cartTransform {
          id
          functionId
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: { functionHandle: "bundle" },
  });

  const cartTransformResponse = (await cartTransformHandle.result()) as {
    cartTransformCreate?: {
      cartTransform?: { id?: string; functionId?: string };
      userErrors?: { field?: string[]; message: string }[];
    };
  };

  if (cartTransformResponse?.cartTransformCreate?.userErrors?.length) {
    logger.error(cartTransformResponse.cartTransformCreate.userErrors[0].message);
  }

  if (Object.keys(updatePayload).length) {
    await api.internal.shopifyShop.update(record.id, updatePayload);
  }

  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
};

export const options: ActionOptions = { actionType: "create" };
