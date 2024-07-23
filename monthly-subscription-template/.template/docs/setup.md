# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Select [Public distribution](https://shopify.dev/docs/apps/distribution) in the "Distribution" tab of the Shopify Partner dashboard.

3. Add `plan` records using your Gadget app's API Playground. You can access an auto-generated GraphQL mutation by navigating to the `plan` model's `create` action and clicking on the **Run action** button to the right of the screen.

4. Using the Partner dashboard, install your Shopify app on a Shopify development store.

5. Test the subscription flow by selecting one of the available plans that you added.

## Subscription flow

- The `shopifyShop` model's `subscribe` action is used when a merchant clicks the **Select** button on a plan card.

  Key functionality of the `subscribe` action:

  - Fetches the selected plan's information
  - Calculates the available trial days for the shop
  - Converts the price of the plan to the shop's currency
  - Calls the Shopify API's [appSubscriptionCreate](https://shopify.dev/docs/api/admin-graphql/2023-07/mutations/appSubscriptionCreate) GraphQL mutation
  - Updates shopifyShop record using `record.field = value` notation

- The user is redirected from the frontend to the subscription confirmation page

  - If rejected, the user is sent back to the Shopify admin
  - If approved, the page is redirected to the `confirmation-callback` route

- The `confirmation-callback` route makes an update to the `shopifyShop` that initiated the subscription flow and redirects to the admin embedded app
