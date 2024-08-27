import {
  applyParams,
  save,
  ActionOptions,
  UpdateReviewActionContext,
} from "gadget-server";

/**
 * @param { UpdateReviewActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  const { changed, current: approved } = record.changes("approved");

  if (changed) {
    const shopify = connections.shopify.current;

    if (approved && !record.metaobjectId) {
      const customer = await api.shopifyCustomer.maybeFindOne(
        record.customerId,
        {
          select: {
            firstName: true,
          },
        }
      );

      // Create the metaobject
      const metaobjectCreateResponse = await shopify.graphql(
        `mutation ($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
            metaobject {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        {
          metaobject: {
            type: "review",
            fields: [
              {
                key: "anonymous",
                value:
                  record.anonymous == true
                    ? record.anonymous.toString()
                    : customer?.firstName
                      ? "true"
                      : "false",
              },
              {
                key: "rating",
                value: JSON.stringify({
                  value: record.rating,
                  scale_max: "5",
                  scale_min: "0",
                }),
              },
              {
                key: "content",
                value: record.content,
              },
              {
                key: "product",
                value: `gid://shopify/Product/${record.productId}`,
              },
            ],
          },
        }
      );

      // Throw an error if Shopify returns an error
      if (metaobjectCreateResponse?.metaobjectCreate?.userErrors?.length)
        throw new Error(
          metaobjectCreateResponse.metaobjectCreate.userErrors[0].message
        );

      // Set the metaobject id on the record
      record.metaobjectId =
        metaobjectCreateResponse.metaobjectCreate.metaobject.id;
    } else if (!approved && record.metaobjectId) {
      // Delete the metaobject
      const metaobjectDeleteResponse = await shopify.graphql(
        `mutation ($id: ID!) {
          metaobjectDelete(id: $id) {
            deletedId
            userErrors {
              message
            }
          }
        }`,
        {
          id: record.metaobjectId,
        }
      );

      // Throw an error if Shopify returns an error
      if (metaobjectDeleteResponse?.metaobjectDelete?.userErrors?.length)
        throw new Error(
          metaobjectDeleteResponse.metaobjectDelete.userErrors[0].message
        );
    }
  }

  await save(record);
}

/**
 * @param { UpdateReviewActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
