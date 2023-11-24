import { globalShopifySync, GlobalShopifySyncGlobalActionContext } from "gadget-server";

/**
 * @param { GlobalShopifySyncGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  await globalShopifySync(params);
};
