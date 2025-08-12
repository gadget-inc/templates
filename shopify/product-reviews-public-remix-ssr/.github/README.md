# Product Reviews

This app allows Shopify merchants to collect, manage, and display customer reviews for fulfilled products. It provides a:

1. Admin UI: To track and approve reviews
2. Email: To automatically send emails to customers when orders are fulfilled
3. Storefront integration: To display approved reviews on product pages

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-reviews-public-remix-ssr.gadget.app)

## Requirements

1. Connect your Gadget app to Shopify
2. Complete customer protected data access and select the email field under “Optional fields”
3. Run `yarn shopify:app dev` in your Gadget terminal to serve the extension
4. Ensure the extension is placed on a product default template

## App Workflow Summary

Order Placed
A requestReviewAfter date is set on the order (a future date to follow up).

Scheduled Action Runs (Hourly)
An action sendReviewRequest checks for fulfilled orders past their requestReviewAfter date.
If found, it triggers the sendEmail action that reminds the customer to send an email.

Email Sent
The customer receives a secure link to submit a review. After sending, the app sets sendReviewRequest to null to avoid sending again.

Customer Submits Review
Review is linked to the product via a metaobject created by the app to display on the storefront.

Merchant Moderates
The merchant approves or rejects the review in the admin panel. Approved reviews are displayed on the product page.

## How to Test it

Confirm Setup
Make sure your extension is visible on your storefront (follow the setup guide if not).

Create an Order
In your Shopify admin, create a test order and select a customer with a valid email you can access.
(Create yourself as a customer if one doesn't exist.)

Fulfill the Order
Mark the order as fulfilled in your Shopify admin.

Check the Order in Gadget
In Gadget, go to the Files tab → api/models/shopifyOrder/data.
Find the order you just created.

If the email is missing, revisit your CPD access settings and ensure email is selected under “Optional fields.” Then recreate the order.

Update Review Trigger Time
In the same data view, set requestReviewAfter to a past date.

Trigger the Review Email
Go to the API tab (API Playground).
Run this command: await api.sendReviewRequests();
This should send the review email.

Submit a Review
Check your email, click the review link, and submit a review.

Approve the Review
In Shopify: Apps > [Your App Name], find and approve the submitted review.

View it on Your Storefront
Visit the product page for the reviewed product.
The approved review should now appear.
