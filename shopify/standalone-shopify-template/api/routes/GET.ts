import { RouteContext } from "gadget-server";

export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
  session,
}: RouteContext) {
  // See if the request is coming from the Shopify admin
  const shopId = connections.shopify.currentShopId;

  // Save the shop id on the session
  if (shopId) {
    session?.set("shop", { _link: shopId });
  }

  // Redirect the user to the standalone dashboard
  return await reply.redirect(`/dashboard`);
}
