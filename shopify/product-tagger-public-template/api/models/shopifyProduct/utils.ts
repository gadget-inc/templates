import { logger, api, connections } from "gadget-server";

// Batch keyword lookups so a large product description doesn't produce one
// oversized filter payload when querying allowed tags.
const TOKEN_BATCH_SIZE = 250;

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

/**
 * Applies tags to a Shopify product using the Shopify API.
 */
export const applyTags = async ({
  tags,
  body,
  id,
}: {
  tags: string[];
  body: string | null;
  id: string;
}) => {
  // get the shopify client for the current shop
  const shopify = connections.shopify.current;
  const shopId = connections.shopify.currentShop?.id;

  if (id && body && shopify && shopId) {
    // Shopify product descriptions can contain HTML, so strip tags before
    // extracting the candidate words we want to match against allowedTag.
    const normalizedBody = body.replace(/<[^>]+>/g, " ");
    const tokens = Array.from(
      new Set(normalizedBody.match(/\w+(?:'\w+)*/g) ?? [])
    );

    if (tokens.length === 0) return;

    const savedKeywords = new Set<string>();
    for (const tokenBatch of chunk(tokens, TOKEN_BATCH_SIZE)) {
      // Query only the keywords that appear in this description instead of
      // scanning every allowedTag record for the shop on each webhook.
      const matchingKeywords = await api.allowedTag.findAll({
        select: {
          keyword: true,
        },
        filter: {
          shopId: {
            equals: String(shopId),
          },
          keyword: {
            in: tokenBatch,
          },
        } as any,
      });

      for (const tag of matchingKeywords) {
        if (tag.keyword) savedKeywords.add(tag.keyword);
      }
    }

    // define tags as a set for quick reads
    const tagsSet = new Set(tags);
    // get list of non-unique keywords to apply as tags
    // make sure they aren't already tags on the product
    const keywordsToApply = [...savedKeywords].filter(
      (keyword) => !tagsSet.has(keyword)
    );

    // use the built-in logger for backend debugging
    logger.info(
      {
        tokenCount: tokens.length,
        savedKeywords: [...savedKeywords],
        keywordsToApply,
      },
      "matched allowed keywords from the product description"
    );

    if (keywordsToApply.length > 0) {
      // merge with existing tags
      const finalTags = Array.from(new Set([...keywordsToApply, ...tags]));

      // log the tags you are applying
      logger.info({ finalTags }, `applying finalTags to product ${id}`);

      // enqueue a background action to write the tags to Shopify
      await api.enqueue(shopify.graphql, {
        query: `mutation ($id: ID!, $tags: [String!]) {
          productUpdate(product: {id: $id, tags: $tags}) {
            product {
              id
            }
            userErrors {
              message
            }
          }
        }`,
        variables: {
          id: `gid://shopify/Product/${id}`,
          tags: finalTags,
        },
      });
    }
  }
};
