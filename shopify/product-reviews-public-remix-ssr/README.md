# Product Reviews

## Core purpose

This app enables Shopify merchants to collect, manage, and display customer reviews for their products. It provides an automated review collection system that requests feedback from customers after purchase, along with a comprehensive admin interface for review moderation and a storefront display system.

## Key functionality

The app automatically sends review request emails to customers based on configurable timing after order fulfillment. Customers can submit reviews through a secure, code-based system that doesn't require account creation. Merchants can approve or reject reviews through the admin interface, and approved reviews are displayed on product pages via a theme extension. The system syncs review data with Shopify using metafields, maintaining review summaries and ratings directly in the merchant's product catalog for seamless integration with their storefront.

## Key features

- Models

  - `review`: Stores review data including the rating, content, and approval status, and links to the corresponding product, customer, and order.
  - `shopifyShop`: Extended with settings for review requests, like `daysUntilReviewRequest`.
  - `shopifyOrder`: Extended to manage when review requests are sent.

- Frontend

  - `web/routes/_app._index.tsx`: The main dashboard for merchants to view and manage product reviews.
  - `web/rotues/_public.review.($code).tsx`: A public page where customers can submit a review for their purchase.
  - `extensions/product-reviews/blocks/productReviews.liquid`: A theme extension block to display approved reviews on product pages.

- Actions

  - `review/create, update, delete`: Allow for the management and approval of reviews.
  - `sendReviewRequests`: A scheduled action to email customers asking for a review after their purchase.
  - `createReviewMetaobject` & `updateReviewsMetafield`: Actions to store review data as Shopify metaobjects and metafields, making them accessible on the storefront.
