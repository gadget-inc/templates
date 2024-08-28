import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: [],
        type: "partner",
        scopes: ["read_products"],
      },
    },
    authentications: {
      settings: {
        redirectOnSignIn: "/signed-in",
        signInPath: "/sign-in",
        unauthorizedUserRedirect: "signInPath",
        defaultSignedInRoles: ["signed-in"],
      },
      methods: {
        emailPassword: true,
        googleOAuth: {
          scopes: ["email", "profile"],
          offlineAccess: false,
        },
      },
    },
  },
};
