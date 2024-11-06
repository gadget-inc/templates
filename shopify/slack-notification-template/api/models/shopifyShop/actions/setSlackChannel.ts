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
    const changes = record.changes("slackChannelId");
    const previous = changes.changed ? changes.previous : null;

    try {
      if (previous) {
        await slackClient.conversations.leave({
          token: record.slackAccessToken as string,
          channel: previous,
        });
      }

      if (record.slackChannelId) {
        await slackClient.conversations.join({
          token: record.slackAccessToken as string,
          channel: record.slackChannelId,
        });
      }
      await save(record);
    } catch (error) {
      throw new Error(error as string);
    }
  }
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
