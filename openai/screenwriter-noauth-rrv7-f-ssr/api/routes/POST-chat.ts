import { RouteHandler } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";

/**
 * Route handler for POST chat
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Body: {
    quote: string;
    movie: string;
  };
}> = async ({ request, reply, api, logger, connections }) => {
  const { quote, movie } = request.body;

  const prompt = `Here is a fake movie quote: "${quote}" and a movie selected by a user: "${movie}". Write a fake scene for that movie that makes use of the quote. Use a maximum of 150 words.`;

  // get streamed response from OpenAI
  const stream = await connections.openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert, hilarious AI screenwriter tasked with generating funny, quirky movie scripts.`,
      },
      { role: "user", content: prompt },
    ],
    stream: true,
  });

  await reply.send(openAIResponseStream(stream));
};

export default route;
