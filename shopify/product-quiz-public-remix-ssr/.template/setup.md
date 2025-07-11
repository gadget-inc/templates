# Setting up your quiz app

The following is a guide to get you started with the product quiz. If you get lost, try following the [full tutorial](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app).

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Make sure that you have the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) installed locally.

3. Create a shopify app proxy that has proxy URL matching `https://<application-slug>--<env-slug>.gadget.app/proxy`. Note the subpath used in the theme app extension's JS file. For more information on Shopify app proxies, read the [Shopify docs](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)

## Setting up liquid files (Online store 1.0)

For themes using Online Store 1.0, instructions are included in the **Install** tab of the admin app. You need to manually copy-paste code files included in the app into the theme.

Make sure to replace `{{ YOUR PROJECT SCRIPT URL }}` in `extensions/quiz/assets/product-quiz.js` with your project's script URL. To find your application's script tag, search for `direct script tag` in your docs. Note that the script tag is different per environment and you should change the script tag before going to production.

## Setting up App Theme Extension (Online store 2.0)

In order to set up a theme app extension for stores using a new Online Store 2.0 theme:

- Update `extensions/quiz/blocks/quiz-page.liquid` by replacing the src on line 7 with your script tag
- Run `yarn dev` in the project root to start the development environment (Shopify CLI)
- Follow Shopify's prompts to connect to your existing Partners app and store
