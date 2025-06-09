import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://product-reviews-public-remix-ssr.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        review: {
          read: {
            filter: "accessControl/filters/review/tenancy.gelly",
          },
          actions: {
            update: true,
          },
        },
        shopifyCustomer: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyCustomer.gelly",
          },
        },
        shopifyFile: {
          read: {
            filter: "accessControl/filters/shopify/shopifyFile.gelly",
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
              "accessControl/filters/shopify/shopifyGdprRequest.gelly",
          },
          actions: {
            create: true,
            update: true,
          },
        },
        shopifyOrder: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrder.gelly",
          },
        },
        shopifyOrderLineItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrderLineItem.gelly",
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProduct.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyProductMedia: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductMedia.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyShop: {
          read: {
            filter: "accessControl/filters/shopify/shopifyShop.gelly",
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
            filter: "accessControl/filters/shopify/shopifySync.gelly",
          },
          actions: {
            abort: true,
            complete: true,
            error: true,
            run: true,
          },
        },
      },
      actions: {
        scheduledShopifySync: true,
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        review: {
          actions: {
            create: true,
          },
        },
      },
      actions: {
        fetchOrderData: true,
      },
    },
  },
};
