import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.0.0",
  plugins: {
    authentications: {
      settings: { redirectOnSignIn: "/signed-in", signInPath: "/sign-in", unauthorizedUserRedirect: "show-403-error", accessControlForSignedInUsers: ["signed-in"] },
      methods: { emailPassword: true, googleOAuth: { scopes: ["email", "profile"], offlineAccess: false } },
    },
  },
};
