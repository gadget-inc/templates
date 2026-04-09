import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v2",
  frameworkVersion: "v1.7.0",
  plugins: { connections: { shopify: { apiVersion: "2026-04" } } },
};
