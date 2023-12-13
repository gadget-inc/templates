import { RouteContext } from "gadget-server";

/**
 * Route handler for GET confirmation-callback
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
}) {
  const { shop_id, plan_id, charge_id } = request.query;

  const shopify = await connections.shopify.forShopId(shop_id);

  // Fetching the subscription from the Shopify Admin GraphQL API. The data is being fetched from Shopify instead of your database in case Shopify hasn't yet sent a webhook (latency).
  const result = await shopify.graphql(`
    query {
      node(id: "gid://shopify/AppSubscription/${charge_id}") {
        id
        ... on AppSubscription {
          status
          currentPeriodEnd
          createdAt
        }
      }
    }
  `);

  if (result?.node?.status != "ACTIVE") {
    await reply.code(400).send("Invalid charge ID specified");
    return;
  }

  // Updating the shop with the relevant information (plan and billing period tracking data)
  const shop = await api.internal.shopifyShop.update(shop_id, {
    plan: {
      _link: plan_id,
    },
    billingPeriodStart: new Date(result?.node?.createdAt),
    billingPeriodEnd: new Date(result?.node?.currentPeriodEnd),
  });

  // Sending the user back to the admin UI
  await reply.redirect(
    `https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`
  );
}
