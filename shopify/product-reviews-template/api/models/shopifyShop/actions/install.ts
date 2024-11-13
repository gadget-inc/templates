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
        type: "$app:review",
        access: {
          storefront: "PUBLIC_READ",
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
          namespace: "$app:productReviews",
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
