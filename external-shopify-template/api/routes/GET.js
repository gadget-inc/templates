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
}) {
  const shopId = connections.shopify.currentShopId;

  if (shopId) {
    const token = jwt.sign(
      {
        shopId: shopId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Setting the authToken on the shop record in case the user used Google SSO
    await api.internal.shopifyShop.update(shopId, {
      authToken: token,
    });

    // Redirect the user to the external dashboard with the authToken as a query parameter
    return await reply.redirect(`/dashboard?authToken=${token}`);
  }

  // Redirect the user to the external dashboard with no query parameters
  await reply.redirect("/dashboard");
}
