import { VerifyConnectionsGlobalActionContext } from "gadget-server";

/**
 * @param { VerifyConnectionsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections, session }) {
  const user = session.get("user");
  const shop = session.get("shop");

  if (!user) throw new Error("User is not signed in");
  if (!shop) return;

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
