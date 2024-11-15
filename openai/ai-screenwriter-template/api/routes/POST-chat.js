import { RouteContext } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";

/**
 * Route handler for POST chat
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  const prompt = `Here is a fake movie quote: "${request.body.quote}" and a movie selected by a user: "${request.body.movie}". Write a fake scene for that movie that makes use of the quote. Use a maximum of 150 words.`;

  // get streamed response from OpenAI
  const stream = await connections.openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `You are an expert, hilarious AI screenwriter tasked with generating funny, quirky movie scripts.` },
      { role: "user", content: prompt }
    ],
    stream: true,
  });

  await reply.send(openAIResponseStream(stream));
}