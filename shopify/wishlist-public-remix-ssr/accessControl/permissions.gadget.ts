import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://wishlist-public-remix-ssr.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        shopifyCustomer: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyCustomer.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyFile: {
          read: {
            filter: "accessControl/filters/shopify/shopifyFile.gelly",
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
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProduct.gelly",
          },
        },
        shopifyProductMedia: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductMedia.gelly",
          },
        },
        shopifyProductVariant: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductVariant.gelly",
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
    "shopify-storefront-customers": {
      storageKey: "Role-Shopify-Customer",
      models: {
        shopifyCustomer: {
          read: {
            filter:
              "accessControl/filters/shopify/storefront-customers/shopifyCustomer.gelly",
          },
        },
        shopifyFile: {
          read: {
            filter: "accessControl/filters/shopifyFile/tenancy.gelly",
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopifyProduct/tenancy.gelly",
          },
        },
        shopifyProductMedia: {
          read: {
            filter:
              "accessControl/filters/shopifyProductMedia/tenancy.gelly",
          },
        },
        shopifyProductVariant: {
          read: {
            filter:
              "accessControl/filters/shopifyProductVariant/tenancy.gelly",
          },
        },
        shopifyShop: {
          read: {
            filter: "accessControl/filters/shopifyShop/tenancy.gelly",
          },
        },
        wishlist: {
          read: {
            filter: "accessControl/filters/wishlist/tenancy.gelly",
          },
          actions: {
            create: true,
            delete: true,
          },
        },
        wishlistItem: {
          read: {
            filter:
              "accessControl/filters/wishlistItem/tenancy.gelly",
          },
          actions: {
            delete: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
    },
  },
};
