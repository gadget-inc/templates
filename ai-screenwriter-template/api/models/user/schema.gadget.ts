import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://ai-screenwriter-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-4yEY3rsONuu8",
  fields: {
    email: { type: "email", validations: { required: true, unique: true }, storageKey: "ModelField-eaCsnGUF1sYS::FieldStorageEpoch-zHhVxHeOtNzG" },
    emailVerificationToken: { type: "string", storageKey: "ModelField-VvQ5Omh6Ku6T::FieldStorageEpoch-syM_e_rInYF1" },
    emailVerificationTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-aWkgtBnUhLWr::FieldStorageEpoch-EU5eOQ-Fg9Nv" },
    emailVerified: { type: "boolean", default: false, storageKey: "ModelField-JLfYhRcsJsSM::FieldStorageEpoch-exZZefJK_RVT" },
    firstName: { type: "string", storageKey: "ModelField-2hsd6_Q5r-r3::FieldStorageEpoch-P9ilLehBP4In" },
    googleImageUrl: { type: "url", storageKey: "ModelField-EMLRZbbhFhFa::FieldStorageEpoch-aoibZstGG_dx" },
    googleProfileId: { type: "string", storageKey: "ModelField-eXJzeFhB0Zl6::FieldStorageEpoch-dQF8IV7KNihL" },
    lastName: { type: "string", storageKey: "ModelField-gu9RFtk2iOen::FieldStorageEpoch-JIkKnCao3UNj" },
    lastSignedIn: { type: "dateTime", includeTime: true, storageKey: "ModelField--3-3h-B0H1Kf::FieldStorageEpoch-Ry-LSS4zgTma" },
    password: { type: "password", validations: { strongPassword: true }, storageKey: "ModelField-cTmQ3CoP0wyb::FieldStorageEpoch-klYT_8nVXHDI" },
    resetPasswordToken: { type: "string", storageKey: "ModelField-8v3DqPFkvjGZ::FieldStorageEpoch-DOb9F7DE1-fu" },
    resetPasswordTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-3oe05w5T6Q-5::FieldStorageEpoch-K46j-ytSmASO" },
    roles: { type: "roleList", default: ["unauthenticated"], storageKey: "ModelField-GaqQKd6bM1iW::FieldStorageEpoch-uxntjZEFzr7L" },
  },
};
