import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "product" model, go to https://stripe-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "1Pf0J_RRt4uw",
  fields: {
    active: { type: "boolean", storageKey: "KGGCkr31cluF" },
    attributes: { type: "json", storageKey: "Bpa_0xhftHOO" },
    defaultPrice: { type: "string", storageKey: "vCD-miTrABMW" },
    description: { type: "string", storageKey: "EvF1WvevdPBl" },
    features: { type: "json", storageKey: "8y1BKJWaNuCj" },
    images: { type: "json", storageKey: "29KBK-Sesxa0" },
    livemode: { type: "boolean", storageKey: "n4Hv6EQRMWxc" },
    metadata: { type: "json", storageKey: "_DiGmzSdOyWL" },
    name: {
      type: "string",
      validations: { required: true },
      storageKey: "NiiNdnuv4BsN",
    },
    object: {
      type: "string",
      validations: { required: true },
      storageKey: "2Yg-CnNqGsqv",
    },
    packageDimensions: { type: "json", storageKey: "2oltFkEiMUcH" },
    prices: {
      type: "hasMany",
      children: { model: "price", belongsToField: "product" },
      storageKey: "pyXY3YvhcvF9",
    },
    shippable: { type: "boolean", storageKey: "2iV2KsufV0p6" },
    statementDescriptor: {
      type: "string",
      storageKey: "CSqqDpV3gzBo",
    },
    stripeCreated: {
      type: "dateTime",
      includeTime: true,
      storageKey: "-sf0sVBY7i5d",
    },
    stripeId: {
      type: "string",
      validations: {
        required: true,
        unique: { caseSensitive: true },
      },
      storageKey: "tg-kJAJpIBfH",
    },
    stripeUpdated: {
      type: "dateTime",
      includeTime: true,
      storageKey: "5jlvTsBQifT_",
    },
    taxCode: { type: "string", storageKey: "g8BNuUCX447N" },
    type: { type: "string", storageKey: "pk56rpxeEWLn" },
    unitLabel: { type: "string", storageKey: "jkfosJ2LcKhW" },
    url: { type: "url", storageKey: "CKuPAiDoG9Kc" },
  },
};
