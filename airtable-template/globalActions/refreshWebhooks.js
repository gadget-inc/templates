import { RefreshWebhooksGlobalActionContext } from "gadget-server";

/**
 * @param { RefreshWebhooksGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const shops = await api.shopifyShop.findMany({
    select: {
      airtableWebhookIds: true,
    },
    filter: {
      airtableWebhookIds: {
        not: null,
      },
      // Track the refresh date
    },
  });

  for (const shop of shops) {
    for (const webhookId of shop.airtableWebhookIds) {
      await fetch(
        `https://api.airtable.com/v0/bases/${process.env.AIRTABLE_BASE_ID}/webhooks/${webhookId}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
          },
        }
      );
    }
  }
}
