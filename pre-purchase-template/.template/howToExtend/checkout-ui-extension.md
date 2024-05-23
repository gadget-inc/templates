### Checkout UI extension overview

The extension code is contained in the `extensions` folder and must be copied to a Shopify CLI app to be run and tested.

There are two main files in the extension:

- `extensions/pre-purchase-ext/shopify.extension.toml`: contains the extension configuration, including the metafield you are using as input for the extension
- `extensions/pre-purchase-ext/src/Checkout.jsx`: contains the extension code, which is a React component that renders the product offer in the checkout
  - note that a storefront API call is made to fetch the first product variant and image for this product

The code used for this extension is very similar to [Shopify's pre-purchase product offer tutorial](https://shopify.dev/docs/apps/checkout/product-offers/pre-purchase/build?framework=react).
