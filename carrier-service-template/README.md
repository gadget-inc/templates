# Carrier Service Template

This application is meant to be used as starter code for implementing a carrier service. It uses the FedEx API to query for rates. These FedEx rates are then formatted in a Shopify-specific way to be used on the storefront's checkout page.

Keep in mind that this tutorial is heavily dependent on how you set up the shipping and delivery settings in your store. Make sure to follow these tutorials to make sure that you have set up the store correctly.

- [Enabling shipping carriers](https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/enabling-shipping-carriers)
- [Setting up shipping rates](https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/setting-up-shipping-rates#create-calculated-shipping-rates)
- [Carrier service API](https://shopify.dev/docs/api/admin-rest/2023-07/resources/carrierservice)

Fedex-related links:

- [FedEx API authorization](https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs.html)
- [FedEx rates and transit time API](https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html)

## Routes

### POST-get-rates.js

Shopify requires that carrier services set up a **POST** route for requesting shipping rates. This route accepts a request body that contains the `origin`, `destination` and `items` for a specific order and returns a list of rates formatted for Shopify. An example request and response can be found on [this page](https://shopify.dev/docs/api/admin-rest/2023-07/resources/carrierservice). Keep in mind that your application must return rates in **less than 3 seconds** (during periods of high traffic) so make sure that your code is as efficient as possible.

## Environment variables

These environment variables are available after creating a project in the **Fedex Developer Portal**.

- FEDEX_ACCOUNT_NUMBER
- FEDEX_SECRET_KEY
- FEDEX_API_KEY

## Steps

Recommendations:

- Starting with a fresh Shopify development store
- Reading the Shopify tutorials and documentation shared at the top of this file

Application Setup:

- Create a new Shopify app and connect it to your Gadget app's development environment. **Do not yet install the app on a development store**
- Create a **FedEx Developer Portal** account and a project
- Fill in the environment variables
- Install the app on your development store. Make sure to view the Gadget logs to make sure that no errors have occurred on installation
- Test the app to make sure that the development store and application are configured correctly

## Testing

- **Postman:** You can use Postman to ping your Gadget app's get-rates route with the example request that Shopify provides
- **Shopify development store:** You can test your application using the checkout on any dev store. If you experience errors in the checkout it's possible that your shipping and delivery settings are not set up properly
