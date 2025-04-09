# Product tagger

Automate product tagging in your Shopify store by matching keywords in product descriptions with predefined tags. This app allows merchants to manage keyword lists in an embedded Admin UI, and automatically applies matching tags to products.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-tagger-custom-rrv7-d.gadget.app)

## Key features

- Models

  - AllowedTag: Stores tag keywords and associates them with specific shops
    - Fields
      - `keyword`: The keyword used for tagging
      - `shop`: The associated shop
  - ShopifyProduct: Synchronizes and stores product data from connected Shopify stores
    - Fields
      - `title`: The product's title
      - `body`: The product's description
      - `tags`: List of tags associated with the product

- Frontend

  - `_app._index`: The main page of the embedded application.

- Actions

  - `shopifyProduct/actions/create`: Reacts to Shopify's `product/create` events, copies product data to the database, and then calls the `applyTags()` function defined in `shopifyProduct/utils.js`.
  - `shopifyProduct/actions/update`: Reacts to Shopify's `product/update` events, copies product data to the database, and then calls the `applyTags()` function defined in `shopifyProduct/utils.js`.
  - `shopifyProduct/utils.js`: Matches incoming product descriptions against keywords in the `allowedTag` model and enqueues updates to Shopify products.
  - `writeToShopify`: Accepts a mutation, variables, and a shopId and makes a GraphQL call to the Shopify API
