import { RouteHandler } from "gadget-server";

/**
 * Route handler for GET proxy/quiz
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{ Querystring: { slug: string; }; }> = async ({
  request,
  reply,
  api,
  logger,
  connections,
}) => {
  if (!connections.shopify.current) {
    return await reply.code(401).send({ error: { message: "Unauthorized" } });
  }

  const { slug } = request.query;

  const quiz = await api.quiz.findFirst({
    filter: {
      slug: {
        equals: slug,
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

  await reply.send(quiz);
};

export default route;
