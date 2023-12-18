# one-time-charge-template

This template is an example of how to handle a one-time charge subscription using the Shopify Billing API.

## Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Select [Public distribution](https://shopify.dev/docs/apps/distribution) in the "Distribution" tab of the Shopify partners dashboard.

3. Install your Shopify app on a Shopify development store.

4. Test the application flow.

## Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Select [Public distribution](https://shopify.dev/docs/apps/distribution) in the "Distribution" tab of the Shopify Partner dashboard.

3. Add a `plan` record using your Gadget app's API Playground. You can access an auto-generated GraphQL mutation by navigating to the `plan` model's `create` action and clicking on the **Run action** button to the right of the screen.

4. Using the Partner dashboard, install your Shopify app on a Shopify development store.

5. Test the payment flow by using the following mutation. Make sure to modify the usedTrialMinutes field to match the number of trial days set on the shop record.

```graphql
mutation {
  internal {
    updateShopifyShop(
      id: "shopId"
      shopifyShop: { oneTimeChargeId: null, usedTrialMinutes: 10080 }
    ) {
      success
    }
  }
}
```

## Payment flow

- The `shopifyShop` model's `subscribe` action is used when a merchant clicks the **Buy now** button on the plan information page.

  Key functionality of the `subscribe` action:

  - Fetches the current plan's information
  - Converts the price of the plan to the shop's currency
  - Calls the Shopify Billing API's appPurchaseOneTimeCreate GraphQL mutation

- The merchant is redirected from the frontend to the subscription confirmation page
  - If rejected, the user is sent back to the Shopify Admin UI
  - If approved, the page is redirected to the `confirmation-callback` route
- The `confirmation-callback` route makes an update to the `shopifyShop` that initiated the subscription flow and redirects to the Shopify Admin UI

## Important information

Some aspects of this application are not super straightforward. This section may shed some light.

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
- Example of gating features in the backend when a merchant isn't paying for the app and is done with the trial
