# Getting started

A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin.

2. Fill out the Protected Customer Data Access form in the Shopify Partner dashboard. Make sure to fill out the optional section.

3. Sync the code locally using `ggt` ([Gadget CLI](https://docs.gadget.dev/reference/ggt#ggt-reference)) and run `yarn dev` to test the application. Note that you're required to have a `shopify.app.toml` to run `yarn dev`. Make sure to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) using these instructions.

4. Install the application on a development store, and add the extension block to the product page. When testing, make sure that you're always running `yarn dev`.

## Testing reviews

- Create an order
  - Go to Shopify Admin and create a new order (add yourself as the customer).
  - Mark the order as paid and fulfilled.
- Modify the `requestReviewAfter` data field
  - In your Gadget app, navigate to the shopifyOrder model data viewer.
  - Find the created order and manually set the `requestReviewAfter` data field to the current date
- Send the review request email
  - Run the sendReviewRequests action in the Gadget app using the API Playground
  - The review request email will be sent to the customer’s email address
- Create review
  - Open the email, and click the provided button to go to the review page
  - Review each product on the page
- Add the theme app extension to your storefront
- Approve reviews
  - Navigate to the Shopify embedded admin UI (store admin app)
  - View the review(s) in the storefront
