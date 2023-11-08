import { RouteContext } from "gadget-server";

/**
 * Route handler for GET confirmation-callback
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
  const { shop_id, charge_id, plan_id } = request.query;

  // the merchant has accepted the charge, so we can grant them access to our application
  // mark the shop as paid by setting the `plan` relationship field to the charged plan record
  const shop = await api.internal.shopifyShop.update(shop_id, {
    plan: {
      _link: plan_id,
    },
    activeRecurringSubscriptionId: `${charge_id}`,
  });

  // send the user back to the embedded app, this URL may be different depending on where your frontend is hosted
  await reply.redirect(
    `https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`
  );
}
