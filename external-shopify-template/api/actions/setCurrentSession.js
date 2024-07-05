import { SetCurrentSessionGlobalActionContext } from "gadget-server";

/**
 * @param { SetCurrentSessionGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const user = await api.user.maybeFindOne(params.userId, {
    select: {
      id: true,
      shopId: true,
    },
  });

  if (!user) throw new Error("No user with this id");

  if (user.shopId) {
    await api.internal.session.update(params.sessionId, {
      shop: { _link: user.shopId },
    });
  }
}

export const params = {
  userId: { type: "string" },
  sessionId: { type: "string" },
};
