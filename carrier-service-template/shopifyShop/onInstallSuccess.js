/**
 * @param { InstallShopifyShopActionContext } context
 */
export default async function ({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  const shopify = connections.shopify.current;

  // A quick check to see that the shopify variable is set so that we don't have an error and crash our app
  if (shopify) {
    // Creating the carrier service inside the shop that just installed our app
    const service = await shopify.carrierService.create({
      name: "carrier-service-template", // Make sure to change this name to your own desired carrier service name
      service_discovery: true,
      // This callback URL is dynamically sent according to the environment being used. Note the difference in URLs (--development)
      callback_url: `${currentAppUrl}get-rates`,
    });

    await api.shopifyShop.setCarrierServiceId(record.id, {
      carrierServiceId: service.id.toString(),
    });
  }
}
