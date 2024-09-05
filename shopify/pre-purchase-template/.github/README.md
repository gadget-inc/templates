# Pre-purchase upsell

This application allows Shopify merchants to select a product from their store, which will be offered to buyers during checkout as a pre-purchase upsell. It integrates with Shopify to sync products and allows merchants to manage offers through an embedded Admin UI. There's a Shopify Checkout UI Extension included in this application.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=pre-purchase-template.gadget.app)

## Key features

- Models

  - ShopifyProduct: Synchronizes and stores product data from connected Shopify stores.
    - Fields
      - `id`: Unique identifier for the product.
      - `title`: Name of the product.
  - ShopifyShop: Tracks Shopify shops where the app is installed.
    - Fields
      - `name`: Name of the Shopify store.
      - `products`: List of products available in the store.
      - `prePurchaseProduct`: Selected product for the pre-purchase upsell.

- Frontend

  - `App.jsx`: Handles routing for the frontend pages.
  - `index.jsx`: Displays the embedded Shopify Admin UI, allowing merchants to select a pre-purchase product.

- Actions

  - `shopifyShop/savePrePurchaseProduct`: Stores the `productId` for the selected pre-purchase offer as a Shopify metafield.
  - `shopifyShop/install`: Syncs Shopify product data to your Gadget database upon app installation.

- Access Controls

  - `shopify-app-users`: Grants users permission to save a selected pre-purchase product offer for the shop.

## How to extend

- [Checkout UI extension](howToExtend/checkout-ui-extension.md)
- [Ideas for extending functionality](howToExtend/ideas.md)
