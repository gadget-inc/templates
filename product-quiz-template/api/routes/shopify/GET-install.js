/**
 * Route handler for GET install
 *
 * @param { import("gadget-server").RouteContext<{ Querystring: { hmac: string; shop: string; apiKey: string; embedded?: "1" } }> } request context - Everything for handling this route, like the api client, Fastify request, Fastify reply, etc. More on effect context: https://docs.gadget.dev/guides/extending-with-code#effect-context
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger, connections }) => {
  const { query, gadgetContext } = request;
  const { hmac, shop: shopDomain, embedded, host: base64Host } = query;
  const { apiKey } = gadgetContext;

  if (!hmac || !shopDomain) {
    // Before rendering this route, Gadget will automatically verify the hmac on your behalf when both of these parameters are present
    // If either is missing, then this is not a request initiated by Shopify so we'll redirect to the root page
    return await reply.redirect("/");
  }

  // if you have two or more apps configured for the same environment, it's possible that you could install the same shop twice on the same environment
  // if we don't find one with this api key, going through the OAuth flow will update any existing shop record with the new api key from this app
  const shop = (await api.shopifyShop.findMany({
    filter: {
      myshopifyDomain: { equals: shopDomain },
      installedViaApiKey: { equals: apiKey },
      state: { inState: "created.installed" }
    }
  }))[0];

  // An array of all the Shopify scopes that your Gadget app requires
  const requiredScopes = Array.from(connections.shopify.configuration.requiredScopes);

  // This is the single entry point to your app from Shopify. It is both the route that is hit on the initial app install
  // as well as every time a merchant clicks on your app in their admin
  if (shop) {
    const hasAllRequiredScopes = requiredScopes.every(requiredScope => shop.grantedScopes?.includes(requiredScope));
    if (embedded) {
      return await reply.redirect("/?" + new URLSearchParams(query).toString());
    } else {
      const host = Buffer.from(base64Host, 'base64').toString('ascii');
      return await reply.redirect(`https://${host}/apps/${apiKey}`);
    }
  }
  else {
    // If there's no shop record, this is a fresh install, proceed through OAuth with Shopify
    logger.info({ shop }, "New app installation, redirecting through OAuth flow");
  }

  // This route will kick-off an OAuth flow with Shopify, pass along all parameters from Shopify (hmac, host, shop, etc)
  const redirectURL = "/api/connections/auth/shopify?" + new URLSearchParams(query).toString();

  // Redirect the merchant through the OAuth flow to grant all required scopes to your Gadget app.
  // At the end of this flow, the App URL in the connection configuration will point back to this route
  await reply.redirect(redirectURL.toString());
}
