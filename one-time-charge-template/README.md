# one-time-charge-template

This template is an example of how to handle a one-time charge subscription using the Shopify Billing API.

## Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Select [Public distribution](https://shopify.dev/docs/apps/distribution) in the "Distribution" tab of the Shopify partners dashboard.

3. Install your Shopify app on a Shopify development store.

4. Test the application flow.

## Application flow

- Merchant installs application
  - They are immediately given trial days (7 as defined by the default `trialDays` field value)
- When the trial expires, the merchant will always be shown a payment page
  - Access to the app returns when the one-time payment has been processed


## Key features

Listed features that the application currently supports.

### Backend

- Trial tracking on install, uninstall, reinstall
- Converting plan currency to shop currency

### Frontend

- Shop wrapper (React context provider)
  - Displays a payment page when the free trial has expired

## Missing features

- A simple way for a developer to modify the cost of using the application
- Feature gating in the backend
