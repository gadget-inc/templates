# One-time charge billing

This application enables merchants to subscribe to an app with a one-time payment. It integrates Shopify's API to handle billing, manage trials, and provide shop-specific billing information.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=one-time-charge-template.gadget.app)

## Key features

- Models

  - Plan: Stores plan information and history, including fields for price, currency, and whether it is the current plan.
  - ShopifyShop: Extends the Shopify shop model to include billing-related fields.
    - Fields:
      - `oneTimeChargeId`: Tracks the charge for a one-time purchase.
      - `trialDays`: Number of trial days available.
      - `usedTrialMinutes`: Time used in trial.
      - `confirmationUrl`: URL to confirm the subscription.

- Frontend

  - `App.jsx`: Handles routing for the frontend pages.
  - `ShopPage.jsx`: Main page of the app.
  - `BillingPage.jsx`: Displays the current plan, and automatically redirects merchants here if their trial has ended.
  - `ShopProvider.jsx`: Provides shop-related data throughout the app.

- Actions

  - `shopifyShop/subscribe`: Fetches plan info, converts the price to shop currency, and calls the Shopify API's `appPurchaseOneTimeCreate` mutation.
  - `shopifyShop/install`: Initializes the trial period by setting `trialStartedAt`.
  - `shopifyShop/reinstall`: Re-initializes the trial period if no one-time charge has been made.
  - `shopifyShop/uninstall`: Tracks trial usage by calculating `usedTrialMinutes`.
  - `plan/setToCurrent`: Marks a plan as the current plan for the subscription page.

- Routes

  - `GET-confirmation-callback.js`: Continues the subscription flow when a merchant accepts the plan, updates the `oneTimeChargeId` field, and redirects to the Admin UI.

- Access Controls
  - `shopify-app-users`: Grants access to shop and billing information on the frontend.
