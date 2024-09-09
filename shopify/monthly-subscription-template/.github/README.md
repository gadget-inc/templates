# Monthly subscription billing

This application enables merchants to select subscription plans for an app, with support for Shopify's Billing API. The app provides a streamlined subscription flow with trial day and billing period management.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=monthly-subscription-template.gadget.app)

## Key features

- Models

  - Plan: Stores available plans with fields like monthly price, currency, trial days, and name.
  - ShopifyShop: The default Shopify shop model, extended with fields for managing subscription-related data.
    - Fields
      - `usedTrialMinutes`: Tracks the trial usage.
      - `activeRecurringSubscriptionId`: Stores the current subscription's ID.
      - `plan`: Links the shop to its subscription plan.

- Frontend

  - `App.jsx`: Contains route definitions and app setup.
  - `ShopPage.jsx`: Main page of the app.
  - `BillingPage.jsx`: Allows merchants to select and manage subscription plans.
  - `ShopProvider.jsx`: Provides shop and subscription details across the app.

- Actions

  - `getPlansAtShopCurrency`: Returns available subscription plans at the shop's currency.
  - `shopifyShop/subscribe`: Initiates the subscription process, including fetching plan info, trial days, and handling Shopify's `appSubscriptionCreate` mutation.
  - `shopifyShop/uninstall`: Updates trial usage and removes subscription data upon uninstallation.

- Routes

  - `GET-confirmation-callback.js`: Handles callbacks after merchants complete payment, linking the shop to its selected plan and redirecting to the Admin UI.

- Access Controls

  - `plan`: Grants merchants visibility of subscription plans.
  - `shopifyShop`: Allows merchants to initiate the subscription process.
