import { SetCurrentSessionGlobalActionContext } from "gadget-server";

/**
 * @param { SetCurrentSessionGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  // Find the user for which to set the currentSession
  const user = await api.user.maybeFindOne(params.userId, {
    select: {
      id: true,
      shopId: true,
    },
  });

  // If no user is returned, throw an error
  if (!user) throw new Error("No user with this id");

  // Update the session with the shopId if the user has a sop relationship
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
