import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quiz" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "eGHFRtoxxkc9",
  fields: {
    body: { type: "string", storageKey: "sGNDwN-oU2oC" },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "quiz" },
      storageKey: "I09gPzwgwcCA",
    },
    results: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "quiz" },
      storageKey: "_hsIrWrJBUYS",
    },
    slug: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "eYa8HonqBrnb",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "I_QaNO1TjPr6",
    },
  },
};
