import { ActionOptions, ScheduledShopifySyncGlobalActionContext } from "gadget-server";
import { globalShopifySync } from "gadget-server/shopify";

const HourInMs = 60 * 60 * 1000;

/**
 * @param { ScheduledShopifySyncGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const syncOnlyModels = connections.shopify.enabledModels
    .filter(model => model.syncOnly)
    .map(model => model.apiIdentifier);

  const syncSince = new Date(Date.now() - 25 * HourInMs)

  await globalShopifySync({
    apiKeys: connections.shopify.apiKeys,
    syncSince,
    models: syncOnlyModels
  });
};

/** @type { ActionOptions } */
export const options = {
  triggers: {
    scheduler: [
      {
        every: "day",
        at: "14:21 UTC",
      },
    ],
  },
};
