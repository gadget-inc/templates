## Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin. Make sure that you fill out the Protected Customer Data Access form in the Shopify Partner dashboard.

2. Sync your application's files locally using the [Gadget CLI](https://docs.gadget.dev/guides/development-tools/cli). An example command can be found at the top left of the application's Gadget editor.

3. Add an empty `shopify.app.toml` file to the root of your application. This will be used to run the Shopify CLI.

4. Modify the CDN URL on `line 2` of `extensions/wishlists-storefront/blocks/addToWishlist.liquid` to point to the correct application and environment.

5. Run `yarn dev` to run the Shopify CLI and connect to the Shopify app created in step 1.

6. Install the application on a development store and create a customer account on the online store. Once this is done, you can step through the application and test the functionality.
