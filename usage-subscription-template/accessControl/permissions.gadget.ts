import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://usage-subscription-template.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        plan: {
          read: true,
        },
        shopifyAppSubscription: {
          read: {
            filter:
              "accessControl/filters/shopifyAppSubscription/shopifyAppSubscription.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
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
        shopifyOrder: {
          read: {
            filter:
              "accessControl/filters/shopifyOrder/shopifyOrder.gelly",
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
            subscribe: true,
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
      },
      actions: {
        planCurrencyToShopCurrency: true,
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
    },
  },
};
