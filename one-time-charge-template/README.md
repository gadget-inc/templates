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

## Important information

Some aspects of this application are not super straightforward. This section may shed some light.

### How to view the billing page

The application's ShopPage component only displays Shopify Polaris skeleton components. Don't be alarmed, you can view the BillingPage by using the following GraphQL mutation in your app's API Playground:

```GraphQL
  mutation {
    internal {
      updateShopifyShop(
        id: "shopId",
        shopifyShop: {
          oneTimeChargeId: null,
          usedTrialMinutes: 10080
        }
      ) {
      success
      }
    }
  }
```

This mutation can be used to manipulate which view you see while you're trying to develop your application.

### Plans

New plan records have their `current` field set to `false` by default. To set a plan record as the plan to use for billing, use the plan model's `setToCurrent` action. This action:

- (Maybe) Finds a currently active plan
- (Maybe) Updates the currently active plan's `current` field to `false`
- Updates the current record's `current` field to `true`

The shopifyShop `subscribe` action will find the first plan with the `current` field set to `true` and use it to create a charge record for the subscribing shop. Make sure to only have one plan with `current` set to `true` or you may end up with unexpected behavior.

## Key features

Listed features that the application currently supports.

### Backend

- Trial tracking on install, uninstall, reinstall
- Converting plan currency to shop currency

### Frontend

- Shop wrapper (React context provider)
  - Displays a payment page when the free trial has expired

## Missing features

- A simple way for a developer to modify the cost of using the application (currently requires a GraphQL mutation)
- Feature gating in the backend
