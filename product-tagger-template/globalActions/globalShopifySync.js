import { globalShopifySync, GlobalShopifySyncGlobalActionContext } from "gadget-server";

/**
 * @param { GlobalShopifySyncGlobalActionContext } context
 */
export async function run({ params, logger, api }) {
  await globalShopifySync(params);
};
