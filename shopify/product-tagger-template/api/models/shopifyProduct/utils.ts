import {
  CreateShopifyProductActionContext,
  logger,
  UpdateShopifyProductActionContext,
} from "gadget-server";
import type { ActionContext } from "./actions/create";

export const applyTags: ActionContext = async ({ record, api, connections }: ApplyTagsParams) => {
  if (record.id && record.body && record.changed("body")) {
    // get a unique list of words used in the record's description
    let newTags = [...new Set(record.body.match(/\w+(?:'\w+)*/g))];

    // filter down to only those words which are allowed
    // a filter condition is used on the api.allowedTag.findMany() request that checks the shop id
    const allowedTags = (
      await api.allowedTag.findMany({
        filter: {
          shopId: {
            equals: String(connections.shopify.currentShopId),
          },
        },
      })
    ).map((tag) => tag.keyword);

    // merge with any existing tags and use Set to remove duplicates
    const finalTags = [
      ...new Set(
        newTags
          .filter((tag) => allowedTags.includes(tag))
          .concat(record.tags as string[])
      ),
    ];
    logger.info(
      { newTags, allowedTags, finalTags },
      `applying final tags to product ${record.id}`
    );

    // write tags back to Shopify
    const shopify = connections.shopify.current;

    if (shopify) {
      logger.info({ message: `writing back to Shopify product ${record.id}` });
      await shopify.product.update(parseInt(record.id), {
        tags: finalTags.join(","),
      });
    }
  }
};
