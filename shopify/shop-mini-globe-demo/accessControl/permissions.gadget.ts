import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://my-shop-mini.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    unauthenticated: {
      storageKey: "unauthenticated",
    },
    "shop-mini-buyers": {
      storageKey: "IRGxhR-OXUXS",
      models: {
        miniBuyer: {
          read: {
            filter: "accessControl/filters/miniBuyer/miniBuyer.gelly",
          },
        },
        shipment: {
          read: {
            filter: "accessControl/filters/shipment/shipment.gelly",
          },
        },
      },
    },
  },
};
