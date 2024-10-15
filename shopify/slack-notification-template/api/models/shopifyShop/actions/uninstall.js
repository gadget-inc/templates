import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
} from "gadget-server";
import { slackClient } from "../../../../utilities";

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, {
    from: ShopifyShopState.Installed,
    to: ShopifyShopState.Uninstalled,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  record.hasSlackAccessToken = false;
  record.slackScopes = null;

  if (record.slackChannelId) {
    await slackClient.conversations.leave({
      token: record.slackAccessToken,
      channel: record.slackChannelId,
    });

    record.slackChannelId = null;
  }
  record.slackAccessToken = null;

  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: false },
};
