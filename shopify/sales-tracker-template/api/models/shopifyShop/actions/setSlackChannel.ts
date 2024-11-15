import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";
import { slackClient } from "../../../../utilities";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  if (record.changed("slackChannelId")) {
    if (!record.slackAccessToken) throw new Error("No Slack access token");

    const changes = record.changes("slackChannelId");
    const previous = changes.changed ? changes.previous : null;

    try {
      if (previous) {
        await slackClient.conversations.leave({
          token: record.slackAccessToken,
          channel: previous,
        });
      }

      if (record.slackChannelId) {
        await slackClient.conversations.join({
          token: record.slackAccessToken,
          channel: record.slackChannelId,
        });
      }
      await save(record);
    } catch (error) {
      throw error;
    }
  }
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
