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
        fieldDefinitions: [
          {
            key: "anonymous",
            type: "boolean",
            required: true,
          },
          {
            key: "rating",
            type: "number_integer",
            required: true,
            validations: [
              {
                name: "max",
                value: "5",
              },
              {
                name: "min",
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
          namespace: "reviews",
          key: "productMetaobjects",
          description: "A list of metaobjects assoicated to this product",
          type: "list.metaobject_reference",
          ownerType: "PRODUCT",
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
