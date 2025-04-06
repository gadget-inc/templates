import { RouteHandler } from "gadget-server";

/**
 * Route handler for POST proxy/item/remove
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Querystring: { logged_in_customer_id: string };
  Body: { variantId: string; wishlistId: string };
}> = async ({ request, reply, api, logger, connections }) => {
  const { logged_in_customer_id } = request.query;
  const { variantId, wishlistId } = request.body;

  // Find the wishlist item that matches the given parameters
  const wishlistItem = await api.wishlistItem.maybeFindFirst({
    filter: {
      wishlistId: {
        equals: wishlistId,
      },
      customerId: {
        equals: logged_in_customer_id,
      },
      variantId: {
        equals: variantId,
      },
    },
    select: {
      id: true,
    },
  });

  // If the wishlist item is not found, return an error
  if (!wishlistItem) {
    return await reply.code(404).send({
      success: false,
      message: "Wishlist item not found",
    });
  }

  // Delete the wishlist item
  await api.wishlistItem.delete(wishlistItem.id);

  await reply.send({
    success: true,
  });
};

export default route;
