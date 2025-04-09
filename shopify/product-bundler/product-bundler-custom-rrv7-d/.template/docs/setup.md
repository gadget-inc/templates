# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Sync the code locally using `ggt` ([Gadget CLI](https://docs.gadget.dev/reference/ggt#ggt-reference)) and run `yarn dev` to test the application. Make sure to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) using these instructions.

3. When running, press the `g` key to open the Shopify GraphiQL UI and run the following command to get your development Cart Transform function id. Add this function id to the `BUNDLER_FUNCTION_ID` environment variable of your development environment.

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
