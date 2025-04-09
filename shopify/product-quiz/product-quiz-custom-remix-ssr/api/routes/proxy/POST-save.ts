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
  if (!connections.shopify.current) {
    return await reply.code(401).send({ error: { message: "Unauthorized" } });
  }

  const { quizId, email, recommendedProducts } = request.body;

  await api.quizResult.create({
    quiz: {
      _link: quizId,
    },
    email: email,
    shopperSuggestions: recommendedProducts.map((recommendedProductId) => ({
      create: {
        product: {
          _link: recommendedProductId,
        },
      },
    })),
  });

  await reply.send();
};

export default route;
