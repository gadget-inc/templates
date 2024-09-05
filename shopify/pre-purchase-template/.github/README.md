# Pre-purchase upsell

This app manages the data used for the selected product, and provides the embedded admin app that merchants use. It does not have the checkout UI extension itself, that code, and setup steps, can be found in the [written tutorial](https://docs.gadget.dev/guides/tutorials/checkout-ui-extension#build-a-pre-purchase-checkout-ui-extension).

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=pre-purchase-template.gadget.app)

## Table of contents

- [Getting started](#getting-started)
- [App overview](#app-overview)
  - [Starter template](#starter-template)
  - [Connections](#connections)
  - [Data modeling + template overview](#data-modeling-template-overview)
    - [Template default models](#template-default-models)
  - [Environment variables](#environment-variables)
  - [Backend (actions + code)](#backend-actions-code)
  - [Access roles + API permissions](#access-roles-api-permissions)
  - [Frontend](#frontend)
- [Extending this template](#extending-this-template)
- [Questions?](#questions)

## Getting started

To test out this app, do the following:

- Go to the Shopify Connections page in Gadget: Connections -> Shopify -> add a Development app
- Set up a Shopify connection by creating a new Shopify Partners app
  - Copy the Client Key and Secret from the Partners dashboard into Gadget
  - Copy the URL and Redirection URL over to the Partners dashboard
- Install the Shopify app on a development store
- Continue with the [tutorial](https://docs.gadget.dev/guides/tutorials/checkout-ui-extension#build-a-pre-purchase-checkout-ui-extension) to build, test, and deploy the checkout UI extension

### Connections

- A **Shopify** connection is already set up for this app, with the **products/read** scope selected and the **shopifyProduct** models imported.
  - You need to add your Shopify Client Key and Secret for the development environment (and production, if desired!)

### Data modeling + template overview

Describe data models used for this app.

- `shopifyProduct`
  - synced Shopify product data

#### Template default models

- `shopifyShop`
  - keeps track Shopify shops that your app has been installed on
  - a custom `prePurchaseProduct` metafield has been added to this model
- `shopifyGdprRequest`
  - provides an interface for dealing with GDPR requests
- `shopifySync`
  - records all attempted syncs, triggered manually, via code, or the automatic nightly sync
- `session`
  - keeps track of user sessions

### Environment variables

No environment variables are used in this app.

### Backend (actions + code)

- `shopifyShop/actions/savePrePurchaseProduct.js`
  - a custom action added to the `shopifyShop` model
  - this action is called by the embedded frontend, and saves the selected product to the `prePurchaseProduct` metafield stored on the `shopifyShop` model

### Access roles + API permissions

Custom permissions have been granted to the `shopify-app-users` role, to allow the embedded admin app to save the selected product as a metafield.

- `shopify-app-users` role
  - `shopifyShop`: `savePrePurchaseProduct` permission has been granted

### Frontend

This frontend uses Gadget's standard Shopify app frontend setup.

- `frontend/ShopPage.jsx`
  - contains the actual embedded frontend code
  - sends requests to the `savePrePurchaseProduct` action using Gadget's React hooks

## Extending this template

Some ideas for extending this template are:

- add Shopify product variants to the connection, and allow merchants to select a variant
- allow for custom image upload

You can also use the same setup steps for other [Shopify checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions), or other types of Shopify extension such as [admin UI extensions](https://shopify.dev/docs/api/admin-extensions) or [Shopify Functions](https://shopify.dev/docs/apps/functions)!

## Questions?

Join our [developer Discord](https://ggt.link/discord) if you have any questions about this template or Gadget!
