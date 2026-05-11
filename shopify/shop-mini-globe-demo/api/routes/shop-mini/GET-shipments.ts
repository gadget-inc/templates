import { RouteHandler } from "gadget-server";

const route: RouteHandler = async ({ reply, api, session }) => {
  if (!session?.get("miniBuyer")) {
    return reply.code(401).send({ error: "Not authenticated" });
  }

  // Gelly read filter scopes this to the current buyer's shipments.
  const shipments = await api.shipment.findMany({
    sort: { lastFetchedAt: "Descending" },
    first: 100,
    select: {
      id: true,
      trackingNumber: true,
      path: true,
      lastFetchedAt: true,
    },
  });

  return reply.send({ shipments });
};

route.options = {
  cors: { origin: true },
};

export default route;
