import { logger, api, connections } from "gadget-server";

export const applyTags = async ({
  tags,
  body,
  id,
}: {
  tags: string[];
  body: string | null;
  id: string;
}) => {
  if (id && body) {
    // get a unique list of words used in the record's description
    let newTags = [...new Set(body.match(/\w+(?:'\w+)*/g))];

    // filter down to only those words which are allowed
    // a filter condition is used on the api.allowedTag.findMany() request that checks the shop id
    const allowedTags = (
      await api.allowedTag.findMany({
        filter: {
          shopId: {
            equals: String(connections.shopify.currentShop?.id),
          },
        },
      })
    ).map((tag) => tag.keyword);

    // merge with any existing tags and use Set to remove duplicates
    const finalTags = [
      ...new Set(
        newTags.filter((tag) => allowedTags.includes(tag)).concat(tags)
      ),
    ];
    logger.info(
      { newTags, allowedTags, finalTags },
      `applying final tags to product ${id}`
    );

    // write tags back to Shopify
    const shopify = connections.shopify.current;

    if (shopify) {
      logger.info({ message: `writing back to Shopify product ${id}` });

      const response = await shopify.graphql(
        `mutation ($id: ID!, $tags: String!) {
          productUpdate(input: {id: $id, tags: $tags}) {
            product {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        {
          id: `gid://shopify/Product/${id}`,
          tags: finalTags.join(","),
        }
      );

      if (response.productUpdate?.userErrors?.length)
        throw new Error(response.productUpdate.userErrors[0].message);
    }
  }
};
