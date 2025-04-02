import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "question" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "aLq-3felUWGl",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "question" },
      storageKey: "1lxufmZHrbOH",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "ZjTxKhuym_y2",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "k9giX_MpWDl-",
    },
  },
};
