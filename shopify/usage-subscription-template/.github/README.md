# Usage subscription billing

This app template enables Shopify app developers to implement a usage-based billing system using the Shopify Billing API.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=usage-subscription-template.gadget.app)

## Key Features

- Global Actions

  - `getPlansAtShopCurrency`: Fetches all available plans at the shop's currency.

- Frontends

  - `App.jsx`: Manages routing for the frontend pages.
  - `ShopPage.jsx`: Main page of the app.
  - `BillingPage.jsx`: Displays plans and allows merchants to switch between them.
  - `providers/ShopProvider.jsx`: Supplies shop information to the rest of the app.

- Models

  - `plan`: Stores data about available plans.
    - Fields
      - `pricePerOrder`: The amount of money that will be charged to the customer per order
      - `cappedAmount`: The amount that can be charged to the customer per month
      - `trialDays`: The number of trial days that the customer has on that plan
      - `shops`: The shops using this plan
  - `usageRecord`: Tracks usage records successfully created in Shopify.
    - Fields
      - `shop`: The shop that the record belongs to
      - `currency`: The currency that was used to charge the customer
      - `price`: The amount that was charged to the customer
  - `shopifyShop`: The default shop model with additional subscription fields.
    - Fields
      - `amountUsedInPeriod`: The amount of money that has been charged to the user in the current billing period
      - `usagePlanId`: The id of the usage billing plan in the Shopify database
      - `overage`: The amount of money that should be charged on the next billing period
      - `inTrial`: If the user is currently in a trial

- Actions

  - `subscribe`: Retrieves the selected plan, calculates trial days, converts plan price to shop currency, and initiates Shopify's `AppSubscriptionCreate` GraphQL mutation.
    - Tags: `added`
  - `uninstall`: Removes any plan-related data from the shop record.
    - Tags: `edited`

- Routes

  - `GET-confirmation-callback.js`: Handles subscription flow after the merchant accepts plan terms.

- Access Controls
  - `shopify-app-users` for `plan`: Merchants can read plans and select from a list.
