import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "stripe/price" model, go to https://stripe-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "d--pmtHAAOaZ",
  fields: {
    active: { type: "boolean", storageKey: "C4spJUM9uQLd" },
    billingScheme: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["per_unit", "tiered"],
      storageKey: "DtDkjPDleFih",
    },
    currency: { type: "string", storageKey: "vOYaUm8TbLrh" },
    customUnitAmount: { type: "string", storageKey: "eVEfMRekz9oj" },
    livemode: { type: "boolean", storageKey: "nWyd6cv8AqMa" },
    lookupKey: { type: "string", storageKey: "3tm-y3l60iBZ" },
    metadata: { type: "json", storageKey: "ocSSR497JonQ" },
    nickname: { type: "string", storageKey: "ybZh-qshG9oo" },
    object: { type: "string", storageKey: "9YOTewAQptS2" },
    product: {
      type: "belongsTo",
      parent: { model: "stripe/product" },
      storageKey: "dtf0K-fqBa87",
    },
    recurring: { type: "json", storageKey: "XHQbJKD0ImTo" },
    stripeCreatedAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "B2HWkkmHGaoF",
    },
    stripeId: {
      type: "string",
      validations: {
        required: true,
        unique: { caseSensitive: true },
      },
      storageKey: "1MDrDyr410ug",
    },
    taxBehavior: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["inclusive", "exclusive", "unspecified"],
      storageKey: "YDaKAy4uIkN8",
    },
    tiersMode: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["graduated", "volume"],
      storageKey: "xaulGWoX9Gk8",
    },
    transformQuantity: { type: "string", storageKey: "P30vCo3Qp1jC" },
    type: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["one_time", "recurring"],
      validations: { required: true },
      storageKey: "D1qsjgR152PP",
    },
    unitAmount: { type: "number", storageKey: "Wr6d37FE47md" },
    unitAmountDecimal: { type: "string", storageKey: "_fsA-jp6KAHM" },
  },
};
