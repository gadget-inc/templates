# Getting started

A pre-requisite for this application is to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) locally. A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin. Make sure that you fill out the Protected Customer Data Access form in the Shopify Partner dashboard.

2. Create a shopify app proxy that has proxy URL matching `https://<application-slug>--<env-slug>.gadget.app/proxy`. Note the subpath used in the theme app extension's JS file.

3. Sync your application's files locally using the [Gadget CLI](https://docs.gadget.dev/guides/development-tools/cli). An example command can be found at the top left of the application's Gadget editor.

4. Run `yarn shopify:dev` to run the Shopify CLI (locally) and connect to the Shopify app created in step 1.

5. Install the application on a development store and create a customer account on the online store. Once this is done, you can step through the application and test the functionality.

## Customer account UI extension

To test the functionality of the customer account UI extension, make sure that you select a preview store on which your application is installed. Run `yarn shopify:dev` locally and type `p` once the Shopify development environment has spun up. Open the link to the customer account UI extension and test the functionality.

Make sure change the application and environment on `line 2` and `5` of `extensions/wishlists/src/api.js`.

## Theme app extension

To test your theme app extension on a storefront, navigate to your installed development store. From there, go to the online store's admin page and click on the `Customize` button next to the theme selector. Here's navigate to a product page and add the section and save.

Make sure to change the value of the proxy subpaths in `extensions/wishlists-storefront/blocks/addToWishlist.js` to your application's (and environment's) URL.
