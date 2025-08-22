# Customized Bundles

## Core Purpose

This app enables Shopify merchants to create, manage, and sell product bundles. It allows merchants to group several individual product variants into a single, purchasable unit, offering curated packages to customers and increasing the average order value.

## Key Functionality

The app provides an admin interface for merchants to define a product variant as a "bundle" and associate other product variants as its components, each with a specified quantity. This bundle data is synchronized with Shopify using metafields. When a customer adds a bundle to their cart, a Shopify Function automatically expands the bundle into its individual component products. This ensures that inventory is tracked correctly and that fulfillment processes are seamless. The app maintains a real-time sync with the merchant's product catalog and manages all bundle logic within the Shopify ecosystem.

Relevant Shopify docs:

- [metafieldDefinitionCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/metafieldDefinitionCreate): Used 3 times to create the metafields `isBundle`, `componentReference` and `productVariantQuantities`
- [cartTransformCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/cartTransformCreate): Creates the Cart Transform function on the store installing the application
- [publications](https://shopify.dev/docs/api/admin-graphql/2024-07/queries/publications): Fetches a list of publications (sales channels) for the store. This is used to specifically fetch the `Online Store` sales channel
- [productCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productCreate): Used when a bundle is created to set title, price, product status and description
- [productVariantUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productVariantUpdate): Used to set the components of the bundle and their quantities when a bundle is created or updated
- [publishablePublish](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/publishablePublish): Called on bundle creation to publish it to the `Online Store`
- [productUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productUpdate): Used to update the title, price, status and description of the bundle
- [metafieldsSet](https://shopify.dev/docs/api/customer/2024-07/mutations/metafieldsSet): Used to modify the quantities of components in the bundle

## Setup

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Sync the code locally using `ggt` ([Gadget CLI](https://docs.gadget.dev/reference/ggt#ggt-reference)) and run `yarn shopify:dev` to test the application. Make sure to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) using these instructions.

3. While dev is running, press the `g` key to open the Shopify GraphiQL UI and run the following command to get your development Cart Transform function id. Add this function id to the `BUNDLER_FUNCTION_ID` environment variable of your development environment.

```graphql
query {
  shopifyFunctions(first: 25) {
    nodes {
      app {
        title
      }
      apiType
      title
      id
    }
  }
}
```

4. In the Shopify Partner dashboard, navigate to the `Extensions` tab and turn on `Development store preview`. This will allow you to run the Shopify Function on your development store.

5. Install the application on a development store, create a bundle and test the function. When testing, make sure that you're always running `yarn dev`.

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

  - `_app._index`: Displays a list of created bundles, expandable to show their components and quantities.
  - `_app.bundle.($id)`: Manages both the creation and update of bundles.

- Global Actions

  - `createBundleInShopify`: Handles all Shopify API mutations necessary to create a new product, update its variant, and set bundle metafields.
  - `updateBundleInShopify`: Updates the bundle product, its variant, and relevant metafields based on input data.
  - `updateBundleComponentQuantity`: Sets the quantity value in the `productVariantQuantities` metafield.
