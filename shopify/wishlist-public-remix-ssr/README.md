# Wishlist template

## Core purpose

This application provides a comprehensive wishlist feature for Shopify stores. It allows shoppers to create multiple wishlists, add product variants to them, and manage their selections through their customer account. This enhances the shopping experience by enabling customers to save products for future purchase, increasing engagement and potential sales.

## Key functionality

- Multi-Wishlist Management: Customers can create, name, and manage several distinct wishlists (e.g., "Birthday List," "Holiday Gift Ideas") directly within their customer account page.
- Theme app extension: An "Add to Wishlist" button is available on product pages, allowing shoppers to easily add items to their chosen wishlist without leaving the product page.
- Customer account UI extension: A dedicated UI within the Shopify Customer Account page allows logged-in users to view all their wishlists, the items in each, and remove items as needed.
- Email notifications: The app is equipped to send emails related to wishlists, such as sharing a wishlist or notifying a customer when a desired out-of-stock item becomes available again.

## Key features

- Global Actions

  - `sendWishlistEmail`: Sends an email to customers based on the state of their wishlist.

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
