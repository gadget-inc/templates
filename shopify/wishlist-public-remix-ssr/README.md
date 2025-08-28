# Wishlist template

## Core purpose

This application provides a comprehensive wishlist feature for Shopify stores. It allows shoppers to create multiple wishlists, add product variants to them, and manage their selections through their customer account. This enhances the shopping experience by enabling customers to save products for future purchase, increasing engagement and potential sales.

## Key functionality

- Multi-Wishlist Management: Customers can create, name, and manage several distinct wishlists (e.g., "Birthday List," "Holiday Gift Ideas") directly within their customer account page.
- Theme app extension: An "Add to Wishlist" button is available on product pages, allowing shoppers to easily add items to their chosen wishlist without leaving the product page.
- Customer account UI extension: A dedicated UI within the Shopify Customer Account page allows logged-in users to view all their wishlists, the items in each, and remove items as needed.
- Email notifications: The app is equipped to send emails related to wishlists, such as sharing a wishlist or notifying a customer when a desired out-of-stock item becomes available again.

## Setup

A pre-requisite for this application is to install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) locally. A list of steps that you should follow:

1. [Connect to Shopify](https://docs.gadget.dev/guides/tutorials/connecting-to-shopify#connecting-to-shopify) using our built-in Shopify plugin. Make sure that you fill out the Protected Customer Data Access form in the Shopify Partner dashboard.

2. Find the application slug and the environment slug. You'll need them for step 3.

<p align="center">
<img src="https://image-hosting--development.gadget.app/public/env-app-slug.png" alt="Photo showing where to find the app and env slug in Gadget UI" width="400px" />
</p>

3. Create a shopify app proxy that has proxy URL matching `https://<application-slug>--<env-slug>.gadget.app/proxy`. Note the subpath used in the theme app extension's JS file. Take a look at these docs if you're unsure how to do so:

- [Shopify docs](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)
- [Gadget docs](https://docs.gadget.dev/guides/plugins/shopify/advanced-topics/extensions#authenticated-requests-with-shopify-app-proxies)

4. Run `yarn shopify:dev` to run the Shopify CLI (in the Gadget terminal) and connect to the Shopify app created in step 1.

5. Install the application on a development store and create a customer account on the online store. Once this is done, you can step through the application and test the functionality.

## Customer account UI extension

To test the functionality of the customer account UI extension, make sure that you select a preview store on which your application is installed. Run `yarn shopify:dev` locally and type `p` once the Shopify development environment has spun up. Open the link to the customer account UI extension and test the functionality.

Make sure change the application and environment on `line 2` and `5` of `extensions/wishlists/src/api.js`.

## Theme app extension

To test your theme app extension on a storefront, navigate to your installed development store. From there, go to the online store's admin page and click on the `Customize` button next to the theme selector. Here's navigate to a product page and add the section and save.

Make sure to change the value of the proxy subpaths in `extensions/wishlists-storefront/blocks/addToWishlist.js` to your application's (and environment's) URL.

## Key features

- Global Actions

  - `sendWishlistEmail`: Sends an email to customers based on the state of their wishlist.

- Frontends

  - `routes/index.jsx`: The main page of the frontend, displaying the default frequency of wishlist-related emails.

- Models

  - `wishlist`: Stores customer wishlist items.
    - Fields
      - `itemCount`: The number of variants that the wishlist has
      - `variants`: The variants that the wishlist contains
  - `wishlistItem`: Links wishlist records to product variants.
    - Fields
      - `wishlist`: The wishlist that the item belongs to
      - `variant`: The variant that the item belongs to

- Actions

  - `shopifyShop/install`: Creates metafield definitions for customer wishlists and wishlist items.

- Access Controls
  - `shopify-storefront-customers` for `wishlist`: Customers can read, create, and delete their wishlists from the customer account UI.
  - `shopify-storefront-customers` for `wishlistItem`: Customers can read and delete their wishlist items.
