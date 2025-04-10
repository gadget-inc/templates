import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    authentications: {
      settings: {
        redirectOnSignIn: "/signed-in",
        signInPath: "/",
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
