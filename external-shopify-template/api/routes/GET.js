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

    return await reply.redirect(`/dashboard?authToken=${token}`);
  }

  await reply.redirect("/dashboard");
}
