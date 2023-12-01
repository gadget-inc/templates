import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SetSlackChannelShopifyShopActionContext,
} from "gadget-server";
import { slackClient } from "../../utilities";

/**
 * @param { SetSlackChannelShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (record.changed("slackChannelId")) {
    const { previous } = record.changes("slackChannelId");
    try {
      if (previous) {
        await slackClient.conversations.leave({
          token: record.slackAccessToken,
          channel: previous,
        });
      }

      await slackClient.conversations.join({
        token: record.slackAccessToken,
        channel: record.slackChannelId,
      });
      await save(record);
    } catch (error) {
      logger.error({ error });
    }
  }
}

/**
 * @param { SetSlackChannelShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
