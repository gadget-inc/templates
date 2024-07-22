import { RouteContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";

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
  // Might need a shop permissions model
  // This would be a has many through relationship between user and shop

  // Chase the flash from the homepage

  // Might be two templates. This is more of a gadget auth template. The other would be some other auth system

  // See if the request is coming from the Shopify admin
  const shopId = connections.shopify.currentShopId;

  if (shopId) {
    session.set("shop", { _link: shopId });
  }

  // Redirect the user to the standalone dashboard
  return await reply.redirect(`/dashboard`);
}
