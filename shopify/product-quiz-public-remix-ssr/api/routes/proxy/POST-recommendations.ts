import { RouteHandler } from "gadget-server";

/**
 * Route handler for POST proxy/recommendations
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Body: { answerIdFilters: [{ id: { equals: string } }] };
}> = async ({ request, reply, api, logger, connections }) => {
  /**
   * Check if the request was made from an authenticated space.
   * If not, return a 401 Unauthorized response.
   */
  if (!connections.shopify.current) {
    return await reply.code(401).send({ error: { message: "Unauthorized" } });
  }

  const { answerIdFilters } = request.body;

  // Find the list of answers based on the provided filters
  const answers = await api.answer.findMany({
    filter: {
      OR: answerIdFilters,
      shopId: {
        equals: String(connections.shopify.currentShop?.id),
      },
    },
    select: {
      recommendedProduct: {
        id: true,
        productSuggestion: {
          id: true,
          title: true,
          body: true,
          handle: true,
          media: {
            edges: {
              node: {
                image: true,
              },
            },
          },
        },
      },
    },
  });

  // Return the found answers to the Shopify storefront
  await reply.send(answers);
};

export default route;
