import { RouteContext } from "gadget-server";

/**
 * Route handler for POST confirmation-callback
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
}) {
  const { shop_id, charge_id } = request.query;

  const shop = await api.internal.shopifyShop.update(shop_id, {
    oneTimeChargeId: charge_id,
  });

  await reply.redirect(
    `https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`
  );
}
