import { ActionOptions } from "gadget-server";
import { globalShopifySync } from "gadget-server/shopify";

const HourInMs = 60 * 60 * 1000;

export const run: ActionRun = async ({ params, logger, api, connections }) => {
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

export const options: ActionOptions = {
  triggers: {
    scheduler: [
      {
        every: "day",
        at: "15:14 UTC",
      },
    ],
  },
};
