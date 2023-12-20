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
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger }) => {
  let missingConfig;

  if (!process.env.FEDEX_ACCOUNT_NUMBER) missingConfig = "FEDEX_ACCOUNT_NUMBER";
  if (!process.env.FEDEX_SECRET_KEY) missingConfig = "FEDEX_SECRET_KEY";
  if (!process.env.FEDEX_API_KEY) missingConfig = "FEDEX_API_KEY";

  if (missingConfig) {
    await reply.code(500).send();
    throw new Error(
      `INVALID CONFIG: Missing environment variable - ${missingConfig}`
    );
  }

  const { destination, origin, items } = request.body.rate; // Data coming from the Shopify request
  const accessToken = await getAccessToken(); // Generating access token using the Fedex API

  if (accessToken) {
    const packages = itemsToPackages(items);
    const rates = await getRates({
      // Querying rates from the Fedex API
      destination,
      origin,
      packages, // Formatting the items array into a Fedex readable set of packages
      accessToken,
    });

    if (rates.length) {
      await reply.code(200).send({ rates: ratesToShopifyRates(rates) }); // Returning formatted rates to the Shopify storefront
    } else {
      await reply.code(503).send(); // If this error was returned, the Fedex test API is most likely experiencing issues
    }
  } else {
    await reply.code(500).send();
  }
};
