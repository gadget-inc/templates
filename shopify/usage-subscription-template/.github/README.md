# Usage subscription billing

This app template enables Shopify app developers to implement a usage-based billing system using the Shopify Billing API.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=usage-subscription-template.gadget.app)

## Key Features

- Global Actions

  - `getPlansAtShopCurrency`: Fetches all available plans at the shop's currency.

- Frontends

  - `App.jsx`: Manages routing for the frontend pages.
    - Tags: `edited`
  - `ShopPage.jsx`: Main page of the app.
    - Tags: `edited`
  - `BillingPage.jsx`: Displays plans and allows merchants to switch between them.
    - Tags: `added`
  - `providers/ShopProvider.jsx`: Supplies shop information to the rest of the app.
    - Tags: `added`

- Models

  - `plan`: Stores data about available plans.
    - Featured Fields: `pricePerOrder`, `cappedAmount`, `trialDays`, `shops`
  - `usageRecord`: Tracks usage records successfully created in Shopify.
    - Featured Fields: `shop`, `currency`, `price`
  - `shopifyShop`: The default shop model with additional subscription fields.
    - Featured Fields: `amountUsedInPeriod`, `usageRecords`, `usagePlanId`, `overage`, `inTrial`

- Actions

  - `subscribe`: Retrieves the selected plan, calculates trial days, converts plan price to shop currency, and initiates Shopify's `AppSubscriptionCreate` GraphQL mutation.
    - Tags: `added`
  - `uninstall`: Removes any plan-related data from the shop record.
    - Tags: `edited`

- Routes

  - `GET-confirmation-callback.js`: Handles subscription flow after the merchant accepts plan terms.

- Access Controls
  - `shopify-app-users` for `plan`: Merchants can read plans and select from a list.
