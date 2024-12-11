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
  await save(record);
};

// Only running the Slack notifcation logic when the trigger is of type "shopify_webhook" so that syncs don't send old order transactions as new sale notifications.
export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  trigger,
}) => {
  if (
    trigger.type === "shopify_webhook" &&
    (record.kind === "sale" || record.kind === "capture") &&
    record.status === "success"
  ) {
    if (!record.shopId)
      throw new Error("Shop ID is required to send Slack notifications");

    const shop = await api.shopifyShop.maybeFindOne(record.shopId, {
      select: {
        slackAccessToken: true,
        slackChannelId: true,
      },
    });

    if (shop?.slackAccessToken && shop?.slackChannelId) {
      await slackClient.chat.postMessage({
        token: shop.slackAccessToken,
        channel: shop.slackChannelId,
        text: `You made a sale! ${
          (record.paymentDetails as { credit_card_name?: string })
            ?.credit_card_name ?? "Unknown"
        } just spent ${record.amount} ${record.currency} on your store!`,
      });
    }
  }
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: false },
};
