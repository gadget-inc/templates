import { RouteHandler } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

type ChatRequestBody = {
  chatId: string;
  messages: ChatCompletionCreateParamsBase["messages"];
};

const route: RouteHandler = async ({
  request,
  reply,
  api,
  logger,
  connections,
}) => {
  const { chatId, messages } = request.body as ChatRequestBody;

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
};
