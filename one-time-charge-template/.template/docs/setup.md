# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Select [Public distribution](https://shopify.dev/docs/apps/distribution) in the "Distribution" tab of the Shopify Partner dashboard.

3. Add a `plan` record using your Gadget app's API Playground. You can access an auto-generated GraphQL mutation by navigating to the `plan` model's `create` action and clicking on the **Run action** button to the right of the screen.

4. Using the Partner dashboard, install your Shopify app on a Shopify development store.

5. Test the payment flow by using the following mutation. Make sure to modify the usedTrialMinutes field to match the number of trial days (in minutes) set on the shop record.

```graphql
// in Gadget app's API Playground
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
