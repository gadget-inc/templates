# Customer wishlists

This app allows merchants' customers to create and manage wishlists. This template includes:

1. Admin UI: To set the wishlist email frequency
2. Theme app extension: To display product's wishlist membership on product pages
3. Customer account UI extension: To display the customer's wishlists
4. Emails: To update the customer on changes to products in their wishlists

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=wishlist-public-remix-ssr.gadget.app)

## Template setup

1. [Connect your Gadget app to Shopify](https://docs.gadget.dev/guides/plugins/shopify/quickstarts/shopify-quickstart)
2. Complete the **protected customer data access (PCDA)** form and select the **email** field under “Optional fields”
   - This form can be found in the **Partner dashboard > your Shopify app > API access > Protected customer data access section**
3. Change `extensions/wishlist-storefront/blocks/wishlist.liquid` to use your environment's CDN URL
   - Find the CDN URL using CMD/CTRL+F (in the file) and search for `/api/client/web.min.js`
   - The CDN URL format is: `https://<your-gadget-app-name>--<your-environment>.gadget.app/api/client/web.min.js`
4. This application uses an [app proxy](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data). Make sure to add the proxy configurations to your development environment TOML
   - Proxy URL: `https://<your-gadget-app-name>--<your-environment>.gadget.app/`
   - Subpath prefix: `apps`
   - Subpath should be a non-deterministic key to avoid collisions with another applications' proxies
     - You can generate a non-deterministic key at [https://randomkeygen.com/](https://randomkeygen.com/)
     - Update the subpath in the `extensions/wishlists-storefront/assets/wishlist.js`. Use CMD/CTRL+F (in the file), searching for `endpoint`, to find the line that needs an update
5. Run `yarn shopify:dev` in your **local** terminal to serve the extension
6. Ensure the extension is placed on a [product template page](https://shopify.dev/docs/storefronts/themes/tools/online-editor). Note that the extension won't be visible until you log in as a customer
7. Preview the customer account UI extension using the preview link available in your **local** terminal

Example proxy setup:

```toml
[app_proxy]
url = "https://wishlist-public-remix-ssr--devaoc.gadget.app"
subpath = "vJPH9wyxLC"
prefix = "apps"
```

## App workflow summary

1. Customer creates or adds items to wishlist

   When a customer creates a new wishlist or adds items to an existing wishlist, the customer metafield is updated via the `metadata.wishlist.metafield.update` action to track which product variants are in which wishlists for that customer.

2. Scheduled email action runs (every 5 minutes)

   The `email.send.wishlist` action runs on a schedule and checks for customers who are due for wishlist update notifications. It looks for customers with:

   - Email marketing consent (subscribed)
   - A `sendUpdateAt` date that has passed
   - Valid email addresses
   - Update frequency not set to "unsubscribed"

3. Email sent for wishlist updates

   When changes are detected in wishlist items (products on sale or removed products), customers receive an email with:

   - Up to 3 products that are now on sale (have compareAtPrice)
   - Up to 3 products that have been removed/deleted
   - The customer's next email update date is calculated based on their frequency preference

4. Customer manages wishlists

   Customers can view and manage their wishlists through the customer account UI extension and interact with wishlist functionality on product pages via the theme extension.

## How to test it

1. Confirm setup

   Make sure your extension is visible on your storefront (follow the setup guide if not)

2. Login as a customer on a dev store

   In the storefront, login as a customer. Navigate to any product detail page (PDP) and create a wishlist

3. Manage your wishlists

   (Using the preview URL) Navigate to the customer account UI and create/edit your wishlists

4. Send an update email

   Find your customer record in the shopifyCustomer table. Edit the `sendUpdateAt` field to the current date. Run the `email.send.wishlist` action in the API playground
