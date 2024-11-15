import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://chatgpt-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-RMU4Oo7ynQCR",
  fields: {
    chats: { type: "hasMany", children: { model: "chat", belongsToField: "user" }, storageKey: "ModelField-IBFtcsKYD5tr::FieldStorageEpoch-VDgRaJK9-WXb" },
    email: { type: "email", validations: { required: true, unique: true }, storageKey: "ModelField-1Xkmu_yuWCRG::FieldStorageEpoch-SIkh09-JCEjb" },
    emailVerificationToken: { type: "string", storageKey: "ModelField-_ZkK4RY_00oS::FieldStorageEpoch-6AmIdhRN5hs-" },
    emailVerificationTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-uA0DMhmx5w1m::FieldStorageEpoch-obWlaoDHjc9Z" },
    emailVerified: { type: "boolean", default: false, storageKey: "ModelField-Rcn8wvhBMDfR::FieldStorageEpoch-0j3t3_hay37Q" },
    firstName: { type: "string", storageKey: "ModelField-D4_ocvRW_qps::FieldStorageEpoch-aUDZNWZ5_dUN" },
    googleImageUrl: { type: "url", storageKey: "ModelField-envxFTbacGlO::FieldStorageEpoch-5Lk_xigT3PRG" },
    googleProfileId: { type: "string", storageKey: "ModelField-uTjf2OogUn_b::FieldStorageEpoch-Q1E7sB67m_9K" },
    lastName: { type: "string", storageKey: "ModelField-GWqndLTLwkQv::FieldStorageEpoch-5gwI2wj9YLOx" },
    lastSignedIn: { type: "dateTime", includeTime: true, storageKey: "ModelField-1QV6TOYiz8iv::FieldStorageEpoch-ZrARjQddZTmB" },
    password: { type: "password", validations: { strongPassword: true }, storageKey: "ModelField-MB5z8gEALAB5::FieldStorageEpoch-uX10is3toySX" },
    resetPasswordToken: { type: "string", storageKey: "ModelField-1naJWyn8lhKF::FieldStorageEpoch-spS0eCb1Tvm5" },
    resetPasswordTokenExpiration: { type: "dateTime", includeTime: true, storageKey: "ModelField-yM82KMBM9mFP::FieldStorageEpoch-CXk3gXp5vzmp" },
    roles: { type: "roleList", default: ["unauthenticated"], storageKey: "ModelField-RAVPOYDKJ89s::FieldStorageEpoch-AjfWL2QwRRFj" },
  },
};
