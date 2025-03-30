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
  const { slug } = request.query;

  logger.info("HIT");

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

  return quiz;
};

export default route;
