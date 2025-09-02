import { ActionOptions } from "gadget-server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const params = {
  pageId: { type: "string" },
  value: { type: "number" },
};

export const run: ActionRun = async ({ params, record }) => {
  if (params.pageId && params.value) {
    await notion.pages.update({
      page_id: params.pageId,
      properties: {
        Value: {
          number: params.value,
        },
      },
    });
  }

  return record;
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "custom",
  triggers: {
    api: true,
  },
};
