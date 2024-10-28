import { save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  connections,
  logger,
}) => {
  logger.info({ params }, "naming chat");
  const { firstMessage } = params;

  if (firstMessage) {
    const response = await connections.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that is given the first message in a conversation with a user and you respond with a short descriptive 3 to 5 word phrase that summarizes what this conversation is likely to be about.",
        },
        { role: "user", content: firstMessage },
      ],
    });

    logger.info({ response }, "openai naming response");

    record.name = response.choices[0].message.content;
    await save(record);
  }
};

export const options: ActionOptions = {
  actionType: "update",
  transactional: false,
  triggers: { api: true },
};

export const params = {
  firstMessage: { type: "string" },
};
