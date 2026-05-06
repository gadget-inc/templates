import { RouteHandler } from "gadget-server";
import jwt from "jsonwebtoken";

const route: RouteHandler = async ({ request, reply, api }) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Authorization header required" });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(
      authHeader.slice(7),
      process.env.GADGET_ENVIRONMENT_JWT_SIGNING_KEY!,
    );
  } catch {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }

  const buyer = await api.internal.miniBuyer.maybeFindFirst({
    filter: { publicId: { equals: decoded.publicId } },
    select: { id: true },
  });

  if (!buyer) {
    return reply.send({ shipments: [] });
  }

  const shipments = await api.internal.shipment.findMany({
    filter: { miniBuyerId: { equals: buyer.id } },
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
