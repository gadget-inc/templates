import { globalShopifySync, GlobalShopifySyncGlobalActionContext } from "gadget-server";

/**
 * @param { GlobalShopifySyncGlobalActionContext } context
 */
export async function run({ params, logger, api }) {
  await globalShopifySync(params);
};

/**
 * @param { GlobalShopifySyncGlobalActionContext } context
 */
export async function onSuccess({ params, logger, api }) {

};

export const options = { triggers: { api: true } }