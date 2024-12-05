import {
  type CreateShopifyAssetActionContext,
  type UpdateShopifyAssetActionContext,
  logger,
} from "gadget-server";

export async function processShopifyThemeVersion(
  record:
    | CreateShopifyAssetActionContext["record"]
    | UpdateShopifyAssetActionContext["record"],
  api:
    | CreateShopifyAssetActionContext["api"]
    | UpdateShopifyAssetActionContext["api"]
) {
  if (record.themeId) {
    // get the current asset's theme to check if it is already marked as using Online Store v2.0
    const theme = await api.shopifyTheme
      .findOne(record.themeId)
      .catch((error) => logger.error({ error }, "theme not found"));
    // if the theme isn't already marked as 2.0 and the asset is a template and a JSON asset, mark the theme as 2.0
    if (
      theme &&
      !theme.usingOnlineStore2 &&
      record.key?.startsWith("templates/") &&
      record.key.endsWith(".json")
    ) {
      // update the usingOnlineStore2 field in Gadget
      await api.internal.shopifyTheme.update(record.themeId, {
        shopifyTheme: {
          usingOnlineStore2: true,
        },
      });
    }
  }
}
