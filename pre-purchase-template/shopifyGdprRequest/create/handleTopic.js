/**
 * Effect code for Create on Shopify GDPR Request
 * @param { import("gadget-server").CreateShopifyGdprRequestActionContext } CreateShopifyGdprRequestActionContext context - Everything for running this effect, like the api client, current record, params, etc
 */
module.exports = async ({ api, record, params }) => {
  switch(record.topic) {
    case "customers/data_request":
      // This process is a manual one. You must provide the customer's data to the store owners directly.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request for more information.
      break;
    case "customers/redact":
      // Your Gadget Shopify connection will automatically delete all customer data in the Shopify models.
      // Use this block to redact any additional customer related data you may have kept in separate models.
      break;
    case "shop/redact":
      // This will be received 48 hours after a store owner uninstalls your app.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact for more information.
      break;
  }
};
