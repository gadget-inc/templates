# Product reviews

This app allows Shopify merchants to create quizzes and suggest products to their customers. It provides a:

1. Admin UI: For create and updating quizzes
2. Theme app extension: To display approved reviews on product pages

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-quiz-public-remix-ssr.gadget.app)

## Template setup

1. [Connect your Gadget app to Shopify](https://docs.gadget.dev/guides/plugins/shopify/quickstarts/shopify-quickstart)
2. Change `extensions/quiz/blocks/quiz.liquid` to use your environment's CDN URL
   - Find the CDN URL using CMD/CTRL+F (in the file) and search for `/api/client/web.min.js`
   - The CDN URL format is: `https://<your-gadget-app-name>--<your-environment>.gadget.app/api/client/web.min.js`
3. This application uses an [app proxy](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)
   - Proxy URL: `https://<your-gadget-app-name>--<your-environment>.gadget.app/`
   - Subpath prefix: `apps`
   - Subpath should be a non-deterministic key to avoid collisions with another applications' proxies
     - You can generate a non-deterministic key at [https://randomkeygen.com/](https://randomkeygen.com/)
     - Update the subpath in the `extensions/quiz/assets/quiz.js`. Use CMD/CTRL+F (in the file), searching for `endpoint`, to find the line that needs an update
4. Run `yarn shopify:deploy:development` to push your development app configurations to Shopify
5. Run `yarn shopify:dev` in your Gadget terminal to serve the extension
6. Ensure that this extension is added to your storefront. It can be added to any page template
7. Create a quiz for testing
8. Navigate to the extension from the store customizer and set the `Quiz ID` in the settings

Example proxy setup:

```toml
[app_proxy]
url = "https://product-quiz-public-remix-ssr--devaoc.gadget.app"
subpath = "d9RjCiUHZo"
prefix = "apps"
```

## App workflow summary

1. Quiz created

   Merchant goes to the application in the store's admin and creates a quiz.

2. Merchant adds extension

   The extension can be added to any template page. A setting called `Quiz ID` must be set for a quiz to be displayed.

3. Customers use quiz

   The quiz is displayed to the merchants customers who can then fill it out and submit to see their product recommendation results.

## How to test it

1. **Confirm setup**

   Make sure your extension is visible on your storefront (follow the setup guide if not).

2. **Fill out the quiz**

   On the development store's storefront UI, navigate to the quiz. Answer the questions, add your email and submit
