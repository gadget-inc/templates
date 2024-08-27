import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://tailwind-css-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-h9ZhnFOmUmLS",
  fields: {
    email: { type: "email", validations: { required: true, unique: true }, storageKey: "ModelField-wGypuN_GMqVz::FieldStorageEpoch-nqPhwz2Kobyh" },
    emailVerificationToken: { type: "string", storageKey: "ModelField-gbG-h_k87AnW::FieldStorageEpoch-Im46LRN47DEX" },
    emailVerificationTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-qhceCdF9rKDw::FieldStorageEpoch-0Am3JoZZ_wRn" },
    emailVerified: { type: "boolean", default: false, storageKey: "ModelField-5g8d9DmFMGAf::FieldStorageEpoch-wzmorRNnO0Hq" },
    firstName: { type: "string", storageKey: "ModelField-nyVNNH9YIFWS::FieldStorageEpoch-oYVXZkB60MMV" },
    googleImageUrl: { type: "url", storageKey: "ModelField-8xp_3PV91E83::FieldStorageEpoch--QynBIK5bUpM" },
    googleProfileId: { type: "string", storageKey: "ModelField-eXNlr_iMN1JR::FieldStorageEpoch-ugybQWb_BwSs" },
    lastName: { type: "string", storageKey: "ModelField-Y3jPiTB7EUAk::FieldStorageEpoch-d572-n9wLY2G" },
    lastSignedIn: { type: "dateTime", includeTime: true, storageKey: "ModelField-H7Zv41mqbpMU::FieldStorageEpoch-K6VnDHr9-QU5" },
    password: { type: "password", validations: { strongPassword: true }, storageKey: "ModelField-axMNjJbuoylp::FieldStorageEpoch-DhZO_oI4vNK6" },
    resetPasswordToken: { type: "string", storageKey: "ModelField-v3ki35h7g-XG::FieldStorageEpoch-1V6E6HCmltwg" },
    resetPasswordTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-DBbU9lgbKW86::FieldStorageEpoch-rCAPujrMpDeM" },
    roles: { type: "roleList", default: ["unauthenticated"], storageKey: "ModelField-fbX9jVkGE1dk::FieldStorageEpoch-3fJGgXS78H6p" },
  },
};
