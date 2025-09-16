# Wishlist template

This app template helps Shopify merchants manage customer wishlists and send automated emails to keep customers informed about their wishlist items.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=wishlist-public-remix-ssr.gadget.app)

## Key Features

- Global Actions

  - `sendWishlistEmail`: Consolidated action that processes all wishlist email functionality. Can be triggered by scheduler (processes all eligible customers) or called directly with a specific customer. Uses p-map for controlled concurrency to prevent overwhelming the platform.

- Frontends

  - `routes/index.jsx`: The main page of the frontend, displaying the default frequency of wishlist-related emails.

- Models

  - `wishlist`: Stores customer wishlist items.
    - Fields
      - `itemCount`: The number of variants that the wishlist has
      - `variants`: The variants that the wishlist contains
  - `wishlistItem`: Links wishlist records to product variants.
    - Fields
      - `wishlist`: The wishlist that the item belongs to
      - `variant`: The variant that the item belongs to

- Actions

  - `shopifyShop/install`: Creates metafield definitions for customer wishlists and wishlist items.

- Access Controls
  - `shopify-storefront-customers` for `wishlist`: Customers can read, create, and delete their wishlists from the customer account UI.
  - `shopify-storefront-customers` for `wishlistItem`: Customers can read and delete their wishlist items.
