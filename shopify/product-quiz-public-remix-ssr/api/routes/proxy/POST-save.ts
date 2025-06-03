import { RouteHandler } from "gadget-server";

/**
 * Route handler for POST proxy/save
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Body: {
    quizId: string;
    email: string;
    recommendedProducts: string[];
  };
}> = async ({ request, reply, api, logger, connections }) => {
  /**
   * Check if the request was made from an authenticated space.
   * If not, return a 401 Unauthorized response.
   */
  if (!connections.shopify.current) {
    return await reply.code(401).send({ error: { message: "Unauthorized" } });
  }

  const { quizId, email, recommendedProducts } = request.body;

  // Save the quiz result with the provided quizId, email, and recommended products
  await api.quizResult.create({
    quiz: {
      _link: quizId,
    },
    shop: {
      _link: String(connections.shopify.currentShop?.id),
    },
    email: email,
    shopperSuggestions: recommendedProducts.map((recommendedProductId) => ({
      create: {
        product: {
          _link: recommendedProductId,
        },
        shop: {
          _link: String(connections.shopify.currentShop?.id),
        },
      },
    })),
  });

  await reply.send();
};

export default route;
