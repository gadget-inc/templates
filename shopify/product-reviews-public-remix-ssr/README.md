# Product reviews

This app allows Shopify merchants to collect, manage, and display customers' product reviews for fulfilled orders. It provides a:

1. Email: To automatically send emails to customers when orders are fulfilled
2. Review page: For customers to write reviews about the products on their order
3. Admin UI: To track and approve reviews
4. Theme app extension: To display approved reviews on product pages

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-reviews-public-remix-ssr.gadget.app)

## Requirements

1. [Connect your Gadget app to Shopify](https://docs.gadget.dev/guides/plugins/shopify/quickstarts/shopify-quickstart)
2. Complete the **protected customer data access (PCDA)** form and select the **email** field under “Optional fields”
   - This form can be found in the **Partner dashboard > your Shopify app > API access > Protected customer data access section**
3. Change `api/utils/review/liquid/main.liquid` to use your environment's CDN URL
   - Find the CDN URL using CMD/CTRL+F (in the file) and search for `/api/client/web.min.js`
   - The CDN URL format is: `https://<your-gadget-app-name>--<your-environment>.gadget.app/api/client/web.min.js`
4. This application uses an [app proxy](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)
   - Configurations can be found in the `shopify.app.development.toml` file
   - Subpath prefix: `apps`
   - Subpath is a non-deterministic key
     - Note that the subpath will need to be changed in the `api/utils/review/liquid/main.liquid` file. You can find where to change it by using CMD/CTRL+F (in the file), searching for `Subpath`
   - Proxy URL: `https://<your-gadget-app-name>--<your-environment>.gadget.app/`
5. Update the proxy subpath in `api/utils/email/render.tsx`
   - You can find where to make the change using CMD/CTRL+F (in the file) and searching for `href`
6. Run `yarn shopify:deploy:development` to push your development app configurations to Shopify
7. Run `yarn shopify:dev` in your Gadget terminal to serve the extension
8. Ensure the extension is placed on a product template

## App workflow summary

1. Order placed

   A `requestReviewAfter` date is set on the order (a future date to follow up).

2. Scheduled action runs (hourly)

   The `email.send` action checks for fulfilled orders past their `requestReviewAfter` date and sends review request emails to customers.

3. Email sent

   The customer receives a secure link to submit a review. After sending, the app sets `sendReviewRequest` to `null` to avoid sending again.

4. Customer submits review

   Review is created as a metaobject to allow easier display on the product page.

5. Merchant moderates

   The merchant approves or rejects the review in the admin panel. Approved reviews are displayed on the product page.

## How to test it

1. **Confirm setup**

   Make sure your extension is visible on your storefront (follow the setup guide if not).

2. **Create an order**

   In your Shopify admin, create a test order and select a customer with a valid email you can access.
   (Create yourself as a customer if one doesn't exist)

3. **Fulfill the order**

   Mark the order as fulfilled in your Shopify admin.

4. **Check the order in Gadget**

   In Gadget, go to the **Files** tab → `api/models/shopifyOrder/data`.
   Find the order you just created.

   If the email is missing, revisit your **PCDA** form settings and ensure **email** is selected under “Optional fields”; then recreate the order.

5. **Update review trigger time**

   In the same data view, set `requestReviewAfter` to a **past date**.

6. **Trigger the review email**

   Go to the API tab (API Playground).
   Run: `await api.email.send()`
   This should send the review email.

7. **Submit a review**

   Check your email, click the review link, and submit a review.

8. **Approve the review**

   In Shopify: **Apps > [Your App Name]**, find and approve the submitted review.

9. **View it on your storefront**

   Visit the product page for the reviewed product.
   The approved review should now appear.
