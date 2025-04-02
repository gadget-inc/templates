import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quiz" model, go to https://product-quiz-custom-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "8m_1ZZioieD4",
  fields: {
    body: { type: "string", storageKey: "Ia9yzrz_f8EU" },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "quiz" },
      storageKey: "u6JK0TL4Edg7",
    },
    results: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "quiz" },
      storageKey: "o7DOhbOrkZbY",
    },
    slug: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "gpHn_wv6NdnK",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "whgYi0XxZAkk",
    },
  },
};
