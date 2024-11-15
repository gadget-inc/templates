import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://blog-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-CB3M854934Y2",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey:
        "ModelField-PWHFLv-g7g7K::FieldStorageEpoch-6mu05BOCag4j",
    },
    emailVerificationToken: {
      type: "string",
      storageKey:
        "ModelField-t61yaboEtKC_::FieldStorageEpoch-U9-m8BoN7lPu",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-xT4jH0nGPAdo::FieldStorageEpoch-DkAbTAsso68c",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey:
        "ModelField-2SOmcbv1_psS::FieldStorageEpoch-kXEumJ-hHNCB",
    },
    firstName: {
      type: "string",
      storageKey:
        "ModelField-5U5PAJ-2GxIr::FieldStorageEpoch-WjWr1zVYSvO-",
    },
    googleImageUrl: {
      type: "url",
      storageKey:
        "ModelField-Q7-KSW2n0MBy::FieldStorageEpoch-F8EKsk4x1WgV",
    },
    googleProfileId: {
      type: "string",
      storageKey:
        "ModelField-LYtCWW2Pkv6L::FieldStorageEpoch-kexnN7eNcDSA",
    },
    lastName: {
      type: "string",
      storageKey:
        "ModelField-Tvh8oQ6518YN::FieldStorageEpoch--U80DT2S341q",
    },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-fosHko_CgR0H::FieldStorageEpoch-wa9pMeCb7YPI",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey:
        "ModelField-dXGoqdVKrZKj::FieldStorageEpoch-aeHV9sMPvR-f",
    },
    posts: {
      type: "hasMany",
      children: { model: "post", belongsToField: "user" },
      storageKey:
        "ModelField-VecvjPm7rs0t::FieldStorageEpoch-b8NM6_pdJWiT",
    },
    resetPasswordToken: {
      type: "string",
      storageKey:
        "ModelField-_wPha2KTdsvg::FieldStorageEpoch-DJyoUSSJpQ8t",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-irW3PMsRj9Pc::FieldStorageEpoch-EJCQpgflF8bM",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-xROVGUtM14Cq::FieldStorageEpoch-pZ54EBeq7cbC",
    },
  },
};
