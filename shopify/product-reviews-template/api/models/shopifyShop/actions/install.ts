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

  logger.info(
    { env: process.env.NODE_ENV },
    "Creating review metaobject definition"
  );

  // For testing purposes
  if (process.env.NODE_ENV == "development") {
    const metaobjectDefinitionsQueryResponse = await shopify.graphql(`
      query {
        metaobjectDefinitions(first: 100) {
          nodes {
            id
            type
          }
        }
      }`);

    logger.info({ metaobjectDefinitionsQueryResponse }, "LOGGING");

    let exists = false,
      deleted = false;

    for (const definition of metaobjectDefinitionsQueryResponse
      .metaobjectDefinitions.nodes) {
      if (definition.type === "review") {
        exists = true;
        record.reviewMetaobjectDefinitionId = definition.id;
      }

      if (definition.type.includes("review")) {
        exists = true;

        const metaobjectDefinitionDeleteResponse = await shopify.graphql(
          `mutation DeleteMetaobjectDefinition($id: ID!) {
            metaobjectDefinitionDelete(id: $id) {
              deletedId
              userErrors {
                message
              }
            }
          }`,
          {
            id: definition.id,
          }
        );

        if (
          metaobjectDefinitionDeleteResponse?.metaobjectDefinitionDelete
            ?.userErrors?.length
        )
          throw new Error(
            metaobjectDefinitionDeleteResponse.metaobjectDefinitionDelete.userErrors[0].message
          );

        deleted = true;
      }
    }

    if (exists) {
      const metafieldDefinitionsQueryResponse = await shopify.graphql(`
        query {
          metafieldDefinitions(first: 250, ownerType: PRODUCT) {
              nodes {
                id
                namespace
                key
              }
          }
        }`);

      for (const metafieldDefinition of metafieldDefinitionsQueryResponse
        .metafieldDefinitions.nodes) {
        if (
          metafieldDefinition.namespace === "productReviews" &&
          metafieldDefinition.key === "reviewMetaobjects"
        )
          record.metaobjectReferenceMetafieldDefinitionId =
            metafieldDefinition.id;

        if (deleted) {
          const metafieldDefinitionDeleteResponse = await shopify.graphql(
            `mutation DeleteMetafieldDefinition($id: ID!, $deleteAllAssociatedMetafields: Boolean!) {
              metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields) {
                deletedDefinitionId
                userErrors {
                  message
                }
              }
            }`,
            {
              id: metafieldDefinition.id,
            }
          );

          if (
            metafieldDefinitionDeleteResponse?.metafieldDefinitionDelete
              ?.userErrors?.length
          )
            throw new Error(
              metafieldDefinitionDeleteResponse.metafieldDefinitionDelete.userErrors[0].message
            );
        }
      }

      if (!deleted) {
        await save(record);
        return;
      }
    }
  }

  const reviewMetaobjectDefinitionCreateResponse = await shopify.graphql(
    `mutation ($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
        }
        userErrors {
          message
        }
      }
    }`,
    {
      definition: {
        type: "review",
        access: {
          storefront: "PUBLIC_READ",
          admin: "MERCHANT_READ",
        },
        fieldDefinitions: [
          {
            key: "anonymous",
            type: "boolean",
            required: true,
          },
          {
            key: "rating",
            type: "rating",
            required: true,
            validations: [
              {
                name: "scale_max",
                value: "5",
              },
              {
                name: "scale_min",
                value: "0",
              },
            ],
          },
          {
            key: "content",
            type: "multi_line_text_field",
            required: true,
          },
          {
            key: "product",
            type: "product_reference",
            required: true,
          },
        ],
      },
    }
  );

  if (
    reviewMetaobjectDefinitionCreateResponse?.metaobjectDefinitionCreate
      ?.userErrors?.length
  )
    throw new Error(
      reviewMetaobjectDefinitionCreateResponse.metaobjectDefinitionCreate.userErrors[0].message
    );

  record.reviewMetaobjectDefinitionId =
    reviewMetaobjectDefinitionCreateResponse.metaobjectDefinitionCreate.metaobjectDefinition.id;

  const metaobjectReferenceMetafieldDefinitionCreationResponse =
    await shopify.graphql(
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
          name: "Reviews",
          namespace: "productReviews",
          key: "reviewMetaobjects",
          description: "A list of metaobjects associated to this product",
          type: "list.metaobject_reference",
          ownerType: "PRODUCT",
          validations: [
            {
              name: "metaobject_definition_id",
              value: record.reviewMetaobjectDefinitionId,
            },
          ],
          access: {
            storefront: "PUBLIC_READ",
            admin: "MERCHANT_READ",
          },
        },
      }
    );

  if (
    metaobjectReferenceMetafieldDefinitionCreationResponse
      ?.metafieldDefinitionCreate?.userErrors?.length
  )
    throw new Error(
      metaobjectReferenceMetafieldDefinitionCreationResponse.metafieldDefinitionCreate.userErrors[0].message
    );

  record.metaobjectReferenceMetafieldDefinitionId =
    metaobjectReferenceMetafieldDefinitionCreationResponse.metafieldDefinitionCreate.createdDefinition.id;

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await api.shopifySync.run({
    shop: {
      _link: record.id,
    },
    domain: record.domain,
  });
};

export const options: ActionOptions = { actionType: "create" };
