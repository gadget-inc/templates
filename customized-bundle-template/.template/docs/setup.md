# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. File sync the code locally and run `yarn dev` to test the application. Note that you're require to have a `shopify.app.toml` to run `yarn dev`. When running, press the `g` key to open the Shopify GraphiQL UI and run the following command to get your development Cart Transform function id.

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

Add this function id to the environment variables of your development environment.

3. Install the application on a development store, create a bundle and test the function.

## Customized bundles

Customized bundles are bundles that are managed by an app. Merchants can't modify the components of a bundle from the Shopify native admin. Note that a bundle doesn't support nesting, meaning that you can't have one bundle in another.

This application has 3 main components: a frontend for adding bundles; a backend for handling the logic of sending changes to the Shopify API; and an extension for building the bundles in the Shopify storefront.
