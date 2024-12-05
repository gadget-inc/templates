import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
} from "gadget-server";
import { slackClient } from "../../../../utilities";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  transitionState(record, {
    from: ShopifyShopState.Installed,
    to: ShopifyShopState.Uninstalled,
  });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  record.hasSlackAccessToken = false;
  record.slackScopes = null;

  if (record.slackChannelId && record.slackAccessToken) {
    await slackClient.conversations.leave({
      token: record.slackAccessToken,
      channel: record.slackChannelId,
    });

    record.slackChannelId = null;
  }
  record.slackAccessToken = null;

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: false },
};
