import { RouteHandler } from "gadget-server";

/**
 * Route handler for GET proxy/quiz
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{ Querystring: { slug: string } }> = async ({
  request,
  reply,
  api,
  logger,
  connections,
}) => {
  /**
   * Check if the request was made from an authenticated space.
   * If not, return a 401 Unauthorized response.
   */
  if (!connections.shopify.current) {
    return await reply.code(401).send({ error: { message: "Unauthorized" } });
  }

  const { slug } = request.query;

  // Get the first quiz that matches the slug and belongs to the current shop
  const quiz = await api.quiz.findFirst({
    filter: {
      slug: {
        equals: slug,
      },
      shopId: {
        equals: String(connections.shopify.currentShop?.id),
      },
    },
    select: {
      id: true,
      title: true,
      body: true,
      questions: {
        edges: {
          node: {
            id: true,
            text: true,
            answers: {
              edges: {
                node: {
                  id: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Return the found quiz to the Shopify storefront
  await reply.send(quiz);
};

export default route;
