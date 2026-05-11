import { RouteHandler } from "gadget-server";
import { verifyShopMiniToken } from "../../shopMiniUtils/verify";
import jwt from "jsonwebtoken";
import { Config } from "gadget-server";
import { SessionRecord } from "@gadget-client/my-shop-mini";

const SHOPIFY_ADMIN_API_URL =
  "https://server.shop.app/minis/admin-api/alpha/graphql.json";

/**
 * Validate required environment variables
 */
function validateEnvVars(
  vars: Record<string, string | undefined>
): string | null {
  for (const [name, value] of Object.entries(vars)) {
    if (!value) {
      return `${name} is not configured`;
    }
  }
  return null;
}

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Route handler for POST shop-mini/auth
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler = async ({
  request,
  reply,
  session,
  api,
  logger,
}) => {
  try {
    // Validate environment configuration
    const GADGET_ENVIRONMENT_JWT_SIGNING_KEY =
      process.env.GADGET_ENVIRONMENT_JWT_SIGNING_KEY;
    const SHOP_MINIS_ADMIN_API_KEY = process.env.SHOP_MINIS_ADMIN_API_KEY;

    const envError = validateEnvVars({
      GADGET_ENVIRONMENT_JWT_SIGNING_KEY,
      SHOP_MINIS_ADMIN_API_KEY,
    });
    if (envError) throw new Error(envError);

    // Extract and validate Shop Mini token
    const shopMiniToken = extractBearerToken(
      request.headers["authorization"] as string
    );
    if (!shopMiniToken) {
      return reply
        .code(401)
        .send("Authorization header with Bearer token required");
    }

    // Verify Shop Mini token with Admin API
    const verification = await verifyShopMiniToken(
      shopMiniToken,
      SHOPIFY_ADMIN_API_URL,
      SHOP_MINIS_ADMIN_API_KEY!
    );

    if (!verification.isValid) {
      return reply
        .code(401)
        .send(verification.error || "Invalid Shop Mini token");
    }

    // Create JWT token with 7-day expiration using publicId
    if (!verification.publicId) {
      return reply.code(400).send("Public ID not available for this user");
    }

    const miniBuyer = await api.miniBuyer.upsert(
      {
        publicId: verification.publicId,
        state: verification.userState!,
        tokenExpiresAt: verification.tokenExpiresAt!,
        on: ["publicId"],
      },
      {
        select: {
          id: true,
          session: {
            id: true,
          },
        },
      }
    );

    let sessionRecord = miniBuyer?.session;
    if (!miniBuyer?.session || !miniBuyer.session.id) {
      sessionRecord = (await api.internal.session.create({
        miniBuyer: { _link: miniBuyer.id },
        roles: ["shop-mini-buyers"],
      })) as SessionRecord;
    }

    const now = Math.floor(Date.now() / 1000);
    const expirationDays = 7;
    const expirationSeconds = expirationDays * 24 * 60 * 60;

    const jwtToken = jwt.sign(
      {
        publicId: verification.publicId,
        userState: verification.userState!,
        iat: now,
        exp: now + expirationSeconds,
        aud: Config.primaryDomain,
        sub: sessionRecord!.id,
      },
      GADGET_ENVIRONMENT_JWT_SIGNING_KEY!
    );

    // Return JWT token to client
    return reply.send({
      token: jwtToken,
      expiresIn: expirationSeconds,
    });
  } catch (error: any) {
    console.error("Auth error:", error);
    return reply.code(500).send(`Authentication failed: ${error.message}`);
  }
};

route.options = {
  cors: {
    origin: (origin) => {
      if (!origin) return true;

      try {
        const url = new URL(origin);

        // Accept all localhost ports (localhost:*)
        if (url.hostname === "localhost") {
          return origin;
        }

        // Reject all other origins
        return false;
      } catch {
        return false;
      }
    },
  },
};

export default route;
