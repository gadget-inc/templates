import { RouteContext } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

type ChatRequestBody = {
  chatId: string;
  messages: ChatCompletionCreateParamsBase["messages"];
};

export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
}: RouteContext<{ Body: ChatRequestBody }>) {
  const { chatId, messages } = request.body;

  logger.info({ chatId, messages }, "creating new chat completion");

  const openAIResponse = await connections.openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    stream: true,
  });

  const onComplete = (content: string | null | undefined) => {
    void api.message.create({
      order: messages.length + 1,
      role: "assistant",
      content,
      chat: {
        _link: chatId,
      },
    });
  };

  await reply.send(openAIResponseStream(openAIResponse, { onComplete }));
}
