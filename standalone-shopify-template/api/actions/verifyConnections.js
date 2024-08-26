import { VerifyConnectionsGlobalActionContext } from "gadget-server";

/**
 * @param { VerifyConnectionsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections, session }) {
  // Get the user and shop from the session
  const user = session.get("user");
  const shop = session.get("shop");

  // Throw error if this global action is called from outside of the signed-in area
  if (!user) throw new Error("User is not signed in");
  if (!shop) return;

  // Looking to see if the permission already exists
  const permission = await api.shopPermission.maybeFindFirst({
    filter: {
      user: {
        equals: user,
      },
      shop: {
        equals: shop,
      },
    },
  });

  // If the permission does not exist, create it
  if (!permission) {
    await api.internal.shopPermission.create({
      user: {
        _link: user,
      },
      shop: {
        _link: shop,
      },
    });
  }
}
