# Product reviews

This template allows merchants to collect and manage reviews for their products, leveraging Shopify's metaobject system for storing review data. Review requests are sent a set number of days after the order is completely fulfilled.

[![Fork template](https://img.shields.io/badge/Fork%20template-%233A0CFF?style=for-the-badge)](https://app.gadget.dev/auth/fork?domain=product-reviews-template.gadget.app)

## Key features

- Models
  - `review`: Stores customer-created reviews with fields such as `metaobjectId`, `approved`, `rating`, `content`, `product`, `order`, `customer`, and `shop`.
- Frontends
  - `web/components/App.jsx`: Displays unauthorized pages.
  - `web/routes/index.jsx`: Displays a table showing reviews that need to be approved.
- Actions
  - `review.create`: Creates a review metaobject in Shopify when the review is first created.
  - `review.update`: Updates the value of the metaobject reference metafield for the product associated with the review.
- Global Actions
  - `sendEmail`: Sends an email to customers who have placed an order, linking them to the review page.
  - `fetchOrderData`: Retrieves the relevant order data for the customer.
  - `createReviewMetaobject`: Creates a review metaobject for a given product.
  - `createReviewsMetafield`: Adds a reviews metafield (initially an empty array) when a product is created.
