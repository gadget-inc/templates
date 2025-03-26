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
  const { quizId, email, recommendedProducts } = request.body;

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
};

export default route;
