# Setting up your quiz app

The following is a guide to get you started with the product quiz. If you get lost, try following the [full tutorial](https://docs.gadget.dev/guides/tutorials/product-recommendation-quiz-app).

## Create an app in the [Shopify partners dashboard](https://partners.shopify.com/)
Under apps, click `create app`

![1-create-app](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FM_QtBL3Rkv1OAMLrRch0a.png)

Create app manually

![2-create-app-manually](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FLxj7BMkevRA26eUYOHRKH.png)

Name your app

![3-name-your-app](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FaEzGIHTvlYSIZco3PNq5N.png)

## Copy the `Client ID` and `Client secret`

Copy `Client ID` from Shopify

![4-copy-id-and-secret](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FMLcOa9R5_fHRC5ibBg9is.png)

Within Gadget, go to `Settings -> Plugins -> Shopify`

![goto-settings](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F83237%2F165286%2FrhYiD3A9Miz9b2sfqvNTx.png)

Paste your `Client ID`

![6-paste-id-and-secret](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FT-DpTi3_B40I_0QWuLguY.png)

Do the same thing for `Client secret`

![4-copy-id-and-secret](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FMLcOa9R5_fHRC5ibBg9is.png)

## Copy `App URL` and `Redirection URL`
Copy your `App URL`

![7-copy-urls](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2F1GxpWvDw0vy0w6syozLZC.png)

Return to Shopify, go to app setup

![8-goto-app-setup](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2F9GGxPZUoIeaztHOGFKwV4.png)

Paste URL into Shopify

![9-paste-app-url-and-redirection](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2Fb7XZUDr68hdfv8XGlctrX.png)

Do the same thing for `Allowed redirection URL`

![7-copy-urls](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2F1GxpWvDw0vy0w6syozLZC.png)

## Install your app to a test store
Go back to overview

![10-goto-overview](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FWOaAbYMN-oATDiL0O65oY.png)

Under test your app, click select store

![11-test-your-app](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FXnyZ6K0dAn4doN-j0Lmkd.png)

Click install app

![12-install-app-store1](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2F102Qzu1AEgf4k3FO-7uVj.png)

Click install again

![13-install-app-store2](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FIGVtfZxRD_rzNht7ZAVdq.png)

## Quiz admin setup!
Follow the next steps complete store setup using Online store 1.0 or 2.0.

You should now see this screen in the admin.

![14-quiz-loaded](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F84948%2F168708%2FWdTytaTLPL26dtUSXT2K1.png)

If you don't see this, double check your app is connected within `plugins -> shopify`.

![Complete-connection](https://docs.gadget.dev/.vite/assets/Completed-Connection.1bbe8e19.png)

## Setting up liquid files (Online store 1.0)

For themes using Online Store 1.0, instructions are included in the **Install** tab of the admin app. You need to manually copy-paste code files included in the app into the theme.

Make sure to replace `{{ YOUR PROJECT SCRIPT URL }}` in `/frontend/assets/product-quiz.js` with your project's script URL.

## Setting up App Theme Extension (Online store 2.0)

In order to set up a theme app extension for stores using a new Online Store 2.0 theme:

- Clone https://github.com/gadget-inc/shopify-app-theme-extension locally to pull down a Shopify CLI app that includes the required theme extension
- Run `yarn install` in the cloned app's root
- Update `extensions/theme-extension/blocks/quiz-page.liquid` to replace line 7 with the Gadget's script tag:

![image](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F76625%2F151832%2FVI7Y2RfeE6y9qvk465DAX.png)

- Run `yarn dev` in the project root to start the app
- Follow Shopify's prompts to connect to your existing Partners app and store
- Run `yarn deploy` to deploy the initial version of the theme extension (and to generate a `.env` file and theme extension id)
- Copy `SHOPIFY_THEME_EXTENSION_ID` from the project's `.env` file
- Paste `SHOPIFY_THEME_EXTENSION_ID` into the Gadget project's environment variable `GADGET_PUBLIC_THEME_EXTENSION_ID`

![image](https://storage.googleapis.com/assets.gadget.dev/template-assets%2Fa%2F76625%2F151832%2FWK__I7iQB7NDD1chT4oM3.png)

Now if you click on the **Preview in theme** button on the **Install** tab of the embedded admin app, your theme extension should be previewed in your store. Make sure to save changes to preview on the live verion of your dev store.