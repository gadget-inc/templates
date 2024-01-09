## Connecting to Shopify

![Add-Connection](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F71319%2F141253%2FKKn1DoM7mn2nWPHGii11S.gif)

- Copy the _App URL_ and _Redirection URL_ back to the Shopify Partners dashboard. These can be pasted on the **App setup** page of your Partners app
- Go back to the **Overview** page of your Partners app and click **Select store** to install on a development store

Your app should successfully install on the development store, and a sync of data should start automatically.

![Complete-connection](https://docs.gadget.dev/.vite/assets/Completed-Connection.1bbe8e19.png)

## Setting up liquid files (Online store 1.0)

Replace `{{ YOUR PROJECT SCRIPT URL }}` in `/frontend/assets/product-quiz.js` with your project's script URL.

## Setting up App Theme Extension (Online store 2.0)

Clone https://github.com/gadget-inc/shopify-app-theme-extension locally

Run `yarn install`

Update `extensions/theme-extension/blocks/quiz-page.liquid` to replace line 7 with the Gadget's script tag:

![image](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F76625%2F151832%2FVI7Y2RfeE6y9qvk465DAX.png)

Run `yarn dev`

Connect to your existing store

run `yarn deploy`

Copy `SHOPIFY_THEME_EXTENSION_ID` from the App Theme Extension project's `.env`.

Paste `SHOPIFY_THEME_EXTENSION_ID` into the Gadget project's environment variable `GADGET_PUBLIC_THEME_EXTENSION_ID`.

![image](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F76625%2F151832%2FWK__I7iQB7NDD1chT4oM3.png)
