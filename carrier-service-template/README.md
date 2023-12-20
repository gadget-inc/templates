# Carrier Service Template

This application is meant to be used as starter code for implementing your own carrier service. It uses the Fedex API to query for rates. These Fedex rates are then formatted in a Shopify-specific way to then be used on the storefront's checkout page.

Keep in mind that this tutorial is heavily dependent on how you set up the shipping and delivery settings in your store. Make sure to follow these tutorials to make sure that you have set up the store correctly.

- [Enabling shipping carriers](https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/enabling-shipping-carriers)
- [Setting up shipping rates](https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/setting-up-shipping-rates#create-calculated-shipping-rates)
- [Carrier service API](https://shopify.dev/docs/api/admin-rest/2023-07/resources/carrierservice)

Gadget-related links:

- [Actions](https://docs.gadget.dev/guides/actions#actions)
- [Routes](https://docs.gadget.dev/guides/http-routes/route-structure)

Fedex-related links:

- [Fedex API authorization](https://developer.fedex.com/api/en-us/catalog/authorization/v1/docs.html)
- [Fedex rates and transit time API](https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html)

Please keep in mind that you are not bound to Fedex and may modify this code to use any delivery service you wish.

## Table of contents

- [Models](#models)
- [Routes](#routes)
- [Environment variables](#environment-variables)
- [Files](#files)
- [Steps](#steps)
- [Testing](#testing)

## Models

This application only requires that you select a couple of scopes. These scopes are `read_shipping` and `write_shipping`. These scopes are used to create a carrier service on the stores that install your application. You may choose to also include the shopifyCarrierService model for testing purposes. It is not required for the template's functionality.

### shopifyShop

#### Fields

- carrierServiceId
  - Type: `string`
  - Default value: None
  - Validations: None

#### Actions

- setCarrierServiceId

  - This action is used to specifically update the carrierServiceId field
  - `shopifyShop/setCarrierServiceId.js`

- install

  - `shopifyShop/install.js`

- reinstall

  - `shopifyShop/reinstall.js`

- uninstall
  - `shopifyShop/uninstall.js`

## Routes

### POST-get-rates.js

Shopify requires that carrier services set up a **POST** route for requesting shipping rates. This route accepts a request body that contains the `origin`, `destination` and `items` for a specific order and returns a list of rates formatted for Shopify. An example request and response can be found on [this page](https://shopify.dev/docs/api/admin-rest/2023-07/resources/carrierservice). Keep in mind that your application must return rates in **less than 3 seconds** (during periods of high traffic) so make sure that your code is as efficient as possible.

## Environment variables

These environment variables are available after creating a project in the **Fedex Developer Portal**.

- FEDEX_SHIPPING_ACCOUNT_NUMBER
- FEDEX_SECRET_KEY
- FEDEX_API_KEY

## Steps

Recommendations:

- Starting with a fresh Shopify development store
- Reading the Shopify tutorials and documentation shared at the top of this file

Application Setup:

- Create a new Shopify app and connect it to your Gadget app's development environment. **Do not yet install the app on a development store**
- Create a **Fedex Developer Portal** account and a project
- Fill in the environment variables
- Install the app on your development store. Make sure to view the Gadget logs to make sure that no errors have occurred on installation
- Test the app to make sure that the development store and application are configured correctly

## Testing

- **Postman:** You can use Postman to ping your route with the example request that Shopify provides
- **Shopify development store:** You can test your application using the checkout on any dev store. If you experience errors in the checkout it is possible that your shipping and delivery settings are not set up properly

&nbsp;
