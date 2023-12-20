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

## Files

`shopifyShop/setCarrierServiceId.js`

```javascript
import { applyParams, preventCrossShopDataAccess, save, ActionOptions, SetCarrierServiceIdShopifyShopActionContext } from "gadget-server";

/**
 * @param { SetCarrierServiceIdShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  if (record.changed("carrierServiceId")) {
    await save(record);
  }
};

/**
 * @param { SetCarrierServiceIdShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
```

`shopifyShop/install.js`

```javascript
import { transitionState, applyParams, save, ActionOptions, ShopifyShopState, InstallShopifyShopActionContext } from "gadget-server";
import { default as saveCarrierServiceId } from "./onInstallSuccess"

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  await saveCarrierServiceId({
    params,
    record,
    logger,
    api,
    connections,
    currentAppUrl,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
```

`shopifyShop/reinstall.js`

```javascript
import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifyShopState, ReinstallShopifyShopActionContext } from "gadget-server";
import { default as saveCarrierServiceId } from "./onInstallSuccess"

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({
  params,
  record,
  logger,
  api,
  connections,
  currentAppUrl,
}) {
  await saveCarrierServiceId({
    params,
    record,
    logger,
    api,
    connections,
    currentAppUrl,
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
```

`shopifyShop/uninstall.js`

```javascript
import { transitionState, applyParams, preventCrossShopDataAccess, save, ActionOptions, ShopifyShopState, UninstallShopifyShopActionContext } from "gadget-server";


/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api }) {
  transitionState(record, { from: ShopifyShopState.Installed, to: ShopifyShopState.Uninstalled });
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  await api.shopifyShop.setCarrierServiceId(record.id, {
    carrierServiceId: "",
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
```

`shopifyShop/onInstallSuccess.js`

```javascript
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
```

`routes/POST-get-rates.js`

```javascript
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
```

`utilities/index.js`

```javascript
export { default as getRates } from "./getRates.js";
export { default as itemsToPackages } from "./itemsToPackages.js";
export { default as ratesToShopifyRates } from "./ratesToShopifyRates.js";
export { default as getAccessToken } from "./getAccessToken.js";
```

`utilities/getAccessToken.js`

```javascript
import { logger } from "gadget-server";

export default async () => {
  try {
    let formBody = [];
    // Required details for requesting an access token from the Fedex API
    const details = {
      grant_type: "client_credentials",
      client_id: process.env.FEDEX_API_KEY,
      client_secret: process.env.FEDEX_SECRET_KEY,
    };
    for (const property in details) {
      // Looping over details to form and encoded string
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    // Requesting an access code from the Fedex (test) API
    const res = await fetch("https://apis-sandbox.fedex.com/oauth/token", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: formBody,
      method: "POST",
    });

    const result = await res.json()

    logger.info({ result }, "GET ACCESS TOKEN RESULT")

    return result.access_token;
  } catch (error) {
    logger.error(error, "ERROR GETTING ACCESS TOKEN CALL");
    return null;
  }
};
```

`utilities/itemsToPackages.js`

```javascript
export default (items) => {
  const packages = [];

  /* 
    Very basic way of making packages
    This doesn't account for size/dimensions of item nor splitting the items into multiple packages if the dimensions are too big
  */
  for (const item of items) {
    packages.push({
      weight: {
        value: (item.quantity * item.grams) / 1000,
        units: "KG",
      },
    });
  }

  return packages;
};
```

`utilities/getRates.js`

```javascript
import { logger } from "gadget-server";

const formatAddresses = (addresses) => {
  const arr = [];
  for (const address of Object.values(addresses)) {
    if (address) {
      arr.push(address);
    }
  }
  return arr;
};

export default async ({ destination, origin, packages, accessToken }) => {
  try {
    const res = await fetch(
      "https://apis-sandbox.fedex.com/rate/v1/rates/quotes",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          accountNumber: {
            value: process.env.FEDEX_SHIPPING_ACCOUNT_NUMBER,
          },
          requestedShipment: {
            shipper: {
              address: {
                streetLines: formatAddresses({
                  address1: origin.address1,
                  address2: origin.address2,
                  address3: origin.address3,
                }),
                city: origin.city,
                stateOrProvinceCode: origin.province,
                postalCode: origin.postal_code,
                countryCode: origin.country,
              },
            },
            recipient: {
              address: {
                streetLines: formatAddresses({
                  address1: destination.address1,
                  address2: destination.address2,
                  address3: destination.address3,
                }),
                city: destination.city,
                stateOrProvinceCode: destination.province,
                postalCode: destination.postal_code,
                countryCode: destination.country,
              },
            },
            pickupType: "DROPOFF_AT_FEDEX_LOCATION",
            requestedPackageLineItems: packages,
            rateRequestType: ["LIST", "INCENTIVE", "ACCOUNT", "PREFERRED"],
          },
        }),
      }
    );

    const result = await res.json()

    logger.info({ result }, "GET RATES RESULT")

    return result.output.rateReplyDetails || [];
  } catch (error) {
    logger.info(error, "ERROR");
    return [];
  }
};
```

`utilities/ratesToShopifyRates.js`

```javascript
export default (rates) => {
  const ratesForShopify = [];
  for (const rate of rates) {
    ratesForShopify.push({
      currency: rate.ratedShipmentDetails[0].currency.toUpperCase(),
      total_price: rate.ratedShipmentDetails[0].totalNetCharge
        .toString()
        .replace(".", ""),
      service_name: rate.serviceName,
      service_code: rate.operationalDetail.serviceCode,
      description: rate.serviceDescription.description,
    });
  }

  return ratesForShopify;
};
```

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
