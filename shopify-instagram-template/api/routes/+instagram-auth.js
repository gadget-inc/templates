import { Server, Config } from "gadget-server";
import fastifyPassport from "@fastify/passport";
import { InstagramStrategy, instagramApiCall } from "../../lib/instagram";
import { logger } from "gadget-server";

fastifyPassport.use(
  "instagram",
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      callbackURL: `${Config.appUrl}auth/instagram/callback`,
      scope: ["user_profile", "user_media"].join(","),
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, { accessToken, refreshToken });
    }
  )
);

/**
 * Route plugin for *
 *
 * @param { Server } server - server instance to customize, with customizations scoped to descendant paths
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Server}
 */
export default async function (server) {
  server.register(require("@fastify/secure-session"), {
    secret: process.env.SESSION_SECRET,
  });
  server.register(fastifyPassport.initialize());
  server.register(fastifyPassport.secureSession());

  // oauth kickoff endpoint
  server.get("/auth/instagram", async (request, reply) => {
    const handler = fastifyPassport.authenticate("instagram", {
      state: request.query.sessionId,
    });

    await handler(request, reply);
  });

  // oauth finished endpoint
  server.get(
    "/auth/instagram/callback",
    {
      preValidation: fastifyPassport.authorize("instagram", {
        failureRedirect: "/?oauthfail=true",
      }),
    },
    async (request, reply) => {
      // get the shop by shopify session SID
      const sessionId = request.query.state;
      if (!sessionId) {
        throw new Error("no sessionId on oauth callback response");
      }
      const shortLivedToken = request.account.accessToken;
      const { token, expiresAt } = await getLongLivedToken(shortLivedToken);
      const session = await request.api.session.findOne(sessionId, {
        select: { id: true, shopId: true, shopifySID: true },
      });

      request.log.info({ session }, "processing oauth callback for session");

      const shopID = session.shopId;

      // set up this account on this shop
      const account = await request.api.instagramAccount.create({
        accessToken: token,
        accessTokenExpiresAt: expiresAt,
        accountName: await getAccountName(token),
        shop: {
          _link: shopID,
        },
      });

      void request.api.instagramAccount.ingestPosts(account.id).catch((err) => {
        logger.error({ err }, "error ingesting posts after oauth");
      });

      logger.info({ account: account.id }, "saved instagram account");

      const shop = await request.api.shopifyShop.findOne(shopID);

      // redirect to the embedded app for this shop
      return await reply.redirect(
        `https://${shop.myshopifyDomain}/admin/apps/${shop.installedViaApiKey}`
      );
    }
  );
}

const getLongLivedToken = async (shortLivedToken) => {
  const url = new URL("https://graph.instagram.com/access_token");
  url.searchParams.append("grant_type", "ig_exchange_token");
  url.searchParams.append("client_secret", process.env.INSTAGRAM_APP_SECRET);

  const json = await instagramApiCall(url, shortLivedToken);
  return {
    token: json["access_token"],
    expiresAt: new Date(new Date().getTime() + json["expires_in"] * 1000),
  };
};

const getAccountName = async (accessToken) => {
  const url = new URL("https://graph.instagram.com/me");
  url.searchParams.append("fields", ["id", "username"].join(","));

  const json = await instagramApiCall(url, accessToken);
  return json["username"];
};
