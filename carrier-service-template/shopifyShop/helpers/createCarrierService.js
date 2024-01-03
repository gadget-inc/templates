export default async ({ shopify, currentAppUrl }) => {
  const service = await shopify.carrierService.create({
    // Make sure to change this name to your own desired carrier service name
    name: "carrier-service-template",
    service_discovery: true,
    // This callback URL is dynamically sent according to the environment being used. Note the difference in URLs (--development)
    callback_url: `${currentAppUrl}rates`,
  });

  return service.id.toString();
};
