# Customized Bundles

The application is designed to manage and create product bundles within a Shopify store, utilizing the Shopify Admin GraphQL API to handle product creation, updates, and metafield management. It allows users to efficiently create, update, and manage bundles of products, providing visibility into each bundle's components and their quantities.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=customized-bundle-template.gadget.app)

## Key features

- Models

  - Bundle: Stores data about product bundles, including title, description, status, price, and components.
    - Actions
      - `create`: Used to create bundles using the Shopify API.
      - `update`: Used to update existing bundles using the Shopify API.
  - BundleComponent: Manages the relationship between bundles and product variants, including the quantity of each variant.
  - ShopifyShop: Stores shop data related to the Shopify store's configuration.
    - Actions
      - `install`: Sets up metafield definitions, the cart transformation function, and retrieves information about the shop's sales channels.

- Frontend

  - `Bundles.jsx`: Displays a list of created bundles, expandable to show their components and quantities.
  - `BundleForm`: Manages both the creation and update of bundles.

- Global Actions

  - `createBundleInShopify`: Handles all Shopify API mutations necessary to create a new product, update its variant, and set bundle metafields.
  - `updateBundleInShopify`: Updates the bundle product, its variant, and relevant metafields based on input data.
  - `updateBundleComponentQuantity`: Sets the quantity value in the `productVariantQuantities` metafield.
