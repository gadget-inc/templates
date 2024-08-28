# Template setup

Time to setup: 5 min

To set up this app on a Shopify development store, you must do the following:

### Step 1: Set up the Shopify connection

Follow [our instructions](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify) to set up the Shopify connection and install on a store that has [checkout extensibility](https://shopify.dev/docs/api/release-notes/developer-previews#checkout-and-customer-accounts-extensibility-developer-preview) enabled.

### Step 2: Set up your extension

The extension code and dependencies are already included in this template! You need to use Gadget's CLI tool, `ggt`, to pull your project down to your local machine so you can use Shopify's CLI to start extension development.

1. Run `npx ggt@latest dev ~/gadget/<YOUR APP DOMAIN> --app=<YOUR APP DOMAIN> --env=development` in your local terminal, and make sure to use your own app domain
2. `cd ~/gadget/<YOUR APP DOMAIN>`
3. `yarn install`
4. `yarn dev`

You should be able to run your extension by following Shopify's prompts.

For more details, follow along with our [tutorial](https://docs.gadget.dev/guides/tutorials/checkout-ui-extension#step-4-build-a-pre-purchase-checkout-ui-extension)
or watch the [video](https://youtu.be/rCXC4tabpSE?t=975).

### Step 3: Test your app

To test your app, you need to:

1. Select a product to be offered in the embedded admin app on your development store
2. Run your Shopify CLI app using `npm dev`, `yarn dev`, or `pnpm dev`. Make sure to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) and create an empty `shopify.app.toml`
3. Open the Shopify Developer Console once your app has started (press `p` in your terminal when prompted, or copy the generated URL)
4. Copy the **Preview link** for your extension and paste in a browser tab

You should now see the product that was selected, offered in the checkout!

**Note**: Make sure your product can be displayed in the checkout and isn't already in your cart! It is possible that you don't see your product offered in checkout if the extension returns `null` due to some of these conditions. See the code in `extensions/pre-purchase-ext/src/Checkout.jsx` for details.
