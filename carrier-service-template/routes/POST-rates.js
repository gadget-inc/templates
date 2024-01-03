import {
  getRates,
  itemsToPackages,
  ratesToShopifyRates,
  getAccessToken,
} from "../utilities";

/**
 * Route handler for POST
 *
 * @param { import("gadget-server").RouteContext } request context - Everything for handling this route, like the api client, Fastify request, Fastify reply, etc. More on effect context: https://docs.gadget.dev/guides/extending-with-code#effect-context
 *
 * This route is the endpoint that the Shopify checkout will call to get rates for the customer to choose from. It will be called every time the customer changes their shipping address or adds/removes items from their cart.
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger }) => {
  let missingConfig;

  // These environment variables are required for the app to work.
  if (!process.env.FEDEX_ACCOUNT_NUMBER) missingConfig = "FEDEX_ACCOUNT_NUMBER";
  if (!process.env.FEDEX_SECRET_KEY) missingConfig = "FEDEX_SECRET_KEY";
  if (!process.env.FEDEX_API_KEY) missingConfig = "FEDEX_API_KEY";

  if (missingConfig) {
    await reply.code(500).send();
    throw new Error(
      `INVALID CONFIG: Missing environment variable - ${missingConfig}`
    );
  }

  // Data coming from the Shopify request
  const { destination, origin, items } = request.body.rate;
  // Generating access token using the Fedex API
  const accessToken = await getAccessToken();

  if (accessToken) {
    // Formatting the items array into a Fedex readable set of packages
    const packages = itemsToPackages(items);
    // Querying rates from the Fedex API
    const rates = await getRates({
      destination,
      origin,
      packages,
      accessToken,
    });

    if (rates.length) {
      // Returning formatted rates to the Shopify storefront
      await reply.code(200).send({ rates: ratesToShopifyRates(rates) });
    } else {
      // If this error was returned, the Fedex test API is most likely experiencing issues
      await reply.code(500).send();
    }
  } else {
    await reply.code(500).send();
  }
};
