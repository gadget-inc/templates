import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "post" model, go to https://blog-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-GpNBaLB7k8oQ",
  fields: {
    author: {
      type: "computed",
      sourceFile: "api/models/post/author.gelly",
      storageKey: "x9QF7-yrW7gT",
    },
    content: {
      type: "richText",
      storageKey:
        "ModelField-2fy3djfMrnrJ::FieldStorageEpoch-pprPdvtMS8Tm",
    },
    isPublished: {
      type: "boolean",
      default: false,
      storageKey:
        "ModelField-7maCpEU0AODc::FieldStorageEpoch-slJFhG_YLrbE",
    },
    title: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey:
        "ModelField-75xbrb0hnhPi::FieldStorageEpoch-ZkjZYMGZyMKk",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey:
        "ModelField-5Hbep2NRmOv7::FieldStorageEpoch-ELmK89wMj1pb",
    },
  },
};
