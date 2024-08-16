import { RouteContext } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";

/**
 * Route handler for POST chat
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  const { chatId, messages } = request.body;

  logger.info({ chatId, messages }, "creating new chat completion");

  const openAIResponse = await connections.openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    stream: true,
  });

  const onComplete = (content) => {
    void api.message.create({
      order: messages.length + 1,
      role: "assistant",
      content,
      chat: {
        _link: chatId
      }
    });
  }

  await reply.send(openAIResponseStream(openAIResponse, { onComplete }));
}
