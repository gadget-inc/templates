import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SetChannelShopifyShopActionContext,
} from "gadget-server";
import { slackClient } from "../../utilities";

/**
 * @param { SetChannelShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (record.changed("slackChannelId")) {
    try {
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
 * @param { SetChannelShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
