import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://product-quiz-template.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        answer: {
          read: {
            filter: "accessControl/filters/answer/tenancy.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        question: {
          read: {
            filter: "accessControl/filters/question/tenancy.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        quiz: {
          read: {
            filter: "accessControl/filters/quiz/tenancy.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        recommendedProduct: {
          read: {
            filter:
              "accessControl/filters/recommendedProduct/tenancy.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyAsset: {
          read: {
            filter:
              "accessControl/filters/shopifyAsset/shopifyAsset.gelly",
          },
        },
        shopifyGdprRequest: {
          read: {
            filter:
              "accessControl/filters/shopifyGdprRequest/shopifyGdprRequest.gelly",
          },
          actions: {
            create: true,
            update: true,
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopifyProduct/shopifyProduct.gelly",
          },
        },
        shopifyProductImage: {
          read: {
            filter:
              "accessControl/filters/shopifyProductImage/shopifyProductImage.gelly",
          },
        },
        shopifyShop: {
          read: {
            filter:
              "accessControl/filters/shopifyShop/shopifyShop.gelly",
          },
          actions: {
            install: true,
            reinstall: true,
            uninstall: true,
            update: true,
          },
        },
        shopifySync: {
          read: {
            filter:
              "accessControl/filters/shopifySync/shopifySync.gelly",
          },
          actions: {
            complete: true,
            error: true,
            run: true,
          },
        },
        shopifyTheme: {
          read: {
            filter:
              "accessControl/filters/shopifyTheme/shopifyTheme.gelly",
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        answer: {
          read: true,
        },
        question: {
          read: true,
        },
        quiz: {
          read: true,
        },
        quizResult: {
          actions: {
            create: true,
          },
        },
        recommendedProduct: {
          read: true,
        },
        shopifyProduct: {
          read: true,
        },
        shopifyProductImage: {
          read: true,
        },
        shopperSuggestion: {
          actions: {
            create: true,
          },
        },
      },
    },
  },
};
