import { RouteContext } from "gadget-server";

/**
 * Route handler for GET hello
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
  session,
}) {
  // See if the request is coming from the Shopify admin
  const shopId = connections.shopify.currentShopId;
  
  // Save the shop id on the session
  if (shopId) {
    session.set("shop", { _link: shopId });
  }

  // Redirect the user to the standalone dashboard
  return await reply.redirect(`/dashboard`);
}
