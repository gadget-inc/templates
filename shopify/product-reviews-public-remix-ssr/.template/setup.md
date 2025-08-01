# Setting up your wishlist app

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin

2. Create a shopify app proxy that has proxy URL matching `https://<application-slug>--<env-slug>.gadget.app/proxy`. Note the subpath used in the theme app extension's JS file. For more information on Shopify app proxies, read the [Shopify docs](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)

3. Run the `shopify app dev` command in the Gadget terminal

4. Embed your theme app extension on the product page of your devalopment store
