import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "post" model, go to https://blog-internal-rrv7-f-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "LA8g6ZDJCKwz",
  fields: {
    author: {
      type: "computed",
      sourceFile: "api/models/post/author.gelly",
      storageKey: "W108s-THOvJs",
    },
    content: {
      type: "richText",
      validations: { required: true },
      storageKey: "4xSo2iuAF0Iu",
    },
    isPublished: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "S3t6ByOFR2Wn",
    },
    title: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "WakjlHbQQvK4",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "ONf2CCYJw87y",
    },
  },
};
