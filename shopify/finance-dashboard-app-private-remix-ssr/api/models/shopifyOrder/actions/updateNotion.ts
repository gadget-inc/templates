import { ActionOptions } from "gadget-server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const params = {
  rowType: { type: "string" },
  value: { type: "number" }
};

export const run: ActionRun = async ({ params, record }) => {
  if (process.env.NOTION_DB_ID && params.rowType && params.value) {
    return await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: process.env.NOTION_DB_ID,
      },
      properties: {
        "Order ID": {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: record.id,
              },
            },
          ],
        },
        Type: {
          type: "select",
          select: {
            name: params.rowType,
          },
        },
        Value: {
          type: "number",
          number: params.value,
        },
        "Created At": {
          type: "date",
          date: {
            start: new Date(Date.now()).toISOString(),
          },
        },
      },
    });
  } else {
    if (!process.env.NOTION_DB_ID)
      throw new Error("NOTION_DB_ID environment variable is not set");
    else
      throw new Error(`Invalid row "orderId: ${record.id}, rowType: ${params.rowType}, value: ${params.value}"`);
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "custom",
  triggers: {
    api: true,
  },
};
