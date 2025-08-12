# Product reviews

This app allows Shopify merchants to collect, manage, and display customers' product reviews for fulfilled orders. It provides a:

1. Admin UI: To track and approve reviews
2. Email: To automatically send emails to customers when orders are fulfilled
3. Theme app extension: To display approved reviews on product pages

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-reviews-public-remix-ssr.gadget.app)

## Requirements

1. [Connect your Gadget app to Shopify](https://docs.gadget.dev/guides/plugins/shopify/quickstarts/shopify-quickstart)
2. Complete the **protected customer data access (PCDA)** form and select the email field under “Optional fields”
3. Run `yarn shopify:dev` in your Gadget terminal to serve the extension
4. Ensure the extension is placed on a product default template

## App workflow summary

1. Order placed

   A `requestReviewAfter` date is set on the order (a future date to follow up).

2. Scheduled action runs (hourly)

   An action `sendReviewRequest` checks for fulfilled orders past their `requestReviewAfter` date.
   If found, it triggers the `sendEmail` action that reminds the customer to send an email.

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
   Run: `await api.sendReviewRequests()`;
   This should send the review email.

7. **Submit a review**

   Check your email, click the review link, and submit a review.

8. **Approve the review**

   In Shopify: **Apps > [Your App Name]**, find and approve the submitted review.

9. **View it on your storefront**

   Visit the product page for the reviewed product.
   The approved review should now appear.
