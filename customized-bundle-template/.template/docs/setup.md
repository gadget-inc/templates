# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Sync the code locally using `ggt` ([Gadget CLI](https://docs.gadget.dev/reference/ggt#ggt-reference)) and run `yarn dev` to test the application. Note that you're require to have a `shopify.app.toml` to run `yarn dev`. When running, press the `g` key to open the Shopify GraphiQL UI and run the following command to get your development Cart Transform function id. Add this function id to the environment variables of your development environment.

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

3. In the Shopify Partner dashboard, navigate to the `Extensions` tab and turn on `Development store preview`. This will allow you to run the Shopify Function on your development store.

4. Install the application on a development store, create a bundle and test the function. When testing, make sure that you're always running `yarn dev`.

## Customized bundles

Customized bundles are bundles that are managed by an app. Merchants can't modify the components of a bundle from the Shopify native admin. Note that a bundle doesn't support nesting, meaning that you can't have one bundle in another.

This application has 3 main components: a frontend for adding bundles; a backend for handling the logic of sending changes to the Shopify API; and an extension for building the bundles in the Shopify storefront.

This application was based off the following Shopify tutorial: [https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-customized-bundle](https://shopify.dev/docs/apps/build/product-merchandising/bundles/add-customized-bundle)
