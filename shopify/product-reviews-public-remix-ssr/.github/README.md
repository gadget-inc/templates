# Product Reviews

This application allows Shopify merchants to collect and display product reviews from their customers. Merchants can approve and manage reviews, and customers can submit reviews with a rating and content. This application includes a theme extension to display reviews on the storefront.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-reviews-public-remix-ssr.gadget.app)

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
