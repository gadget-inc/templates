import { RouteHandler } from "gadget-server";

/**
 * Route handler for POST proxy/wishlist/create
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Querystring: { logged_in_customer_id: string };
  Body: { variantId: string; name: string };
}> = async ({ request, reply, api, logger, connections }) => {
  const { variantId, name } = request.body;
  const { logged_in_customer_id } = request.query;

  return await api.wishlist.create({
    name,
    shop: {
      _link: String(connections.shopify.currentShop?.id),
    },
    customer: {
      _link: logged_in_customer_id,
    },
    wishlistItems: [
      {
        create: {
          variant: {
            _link: variantId,
          },
          shop: {
            _link: String(connections.shopify.currentShop?.id),
          },
          customer: {
            _link: logged_in_customer_id,
          },
        },
      },
    ],
  });
};

export default route;
