# Order transaction notifications with Slack

This app enables Shopify merchants to receive Slack notifications for completed transactions. Merchants can authenticate via Slack, select a channel, and receive real-time updates directly in Slack when an order is completed in their store.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-tagger-template.gadget.app)

## Key features

- Global Actions

  - `getChannels`: Fetches the available public channels from the installed Slack organization.
  - `getSlackAuthRedirect`: Generates a redirect URL to initiate the Slack OAuth flow.

- Models

  - ShopifyShop: The default Shopify shop model extended with Slack-related fields.
    - Fields
      - `hasSlackAccessToken`: Indicates if the shop has a valid Slack OAuth token.
      - `slackChannelId`: The ID of the selected Slack channel for notifications.
      - `slackScopes`: The authorized Slack scopes.
      - `slackAccessToken`: The shop's Slack access token.

- Frontend

  - `ShopPage.jsx`: The main page of the app that handles Slack authentication and channel selection for merchants.

- Actions

  - ShopifyShop
    - `setSlackChannel`: Assigns a new Slack channel ID to the shop record or keeps the current one if set.
    - `uninstall`: Removes the Slack channel ID from the shop record if one exists.
  - ShopifyOrderTransaction
    - `create`: Sends a notification to the merchant's chosen Slack channel if triggered by a webhook and the merchant has completed the Slack OAuth flow and set a channel.

- Routes

  - `slack/GET-callback.js`: Handles the callback from the Slack OAuth flow and finalizes the connection process.

- Access Controls

  - `shopify-app-users`: Grants merchants permission to read current subscription information and set the Slack channel for notifications.
