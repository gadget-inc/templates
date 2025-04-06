import { RouteHandler } from "gadget-server";

/**
 * Route handler for POST proxy/wishlist/item/create
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Querystring: { logged_in_customer_id: string };
  Body: { variantId: string; wishlistId: string };
}> = async ({ request, reply, api, logger, connections }) => {
  const { wishlistId, variantId } = request.body;
  const { logged_in_customer_id } = request.query;

  await api.wishlistItem.create({
    wishlist: {
      _link: wishlistId,
    },
    variant: {
      _link: variantId,
    },
    shop: {
      _link: String(connections.shopify.currentShop?.id),
    },
    customer: {
      _link: logged_in_customer_id,
    },
  });

  await reply.send({
    success: true,
  });
};

export default route;
