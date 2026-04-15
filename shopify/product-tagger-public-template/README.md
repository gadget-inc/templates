# Product Tagger

Product Tagger lets merchants define approved keywords and automatically applies them as Shopify product tags when those keywords appear in a product's description.

## Setup

1. Connect the app to Shopifand install it on a development store in Gadget: **Settings** > **Plugins** > **Shopify** > **Connect a Shopify app**
2. Open the embedded app in Shopify Admin and add one or more allowed keywords.
3. Create or update a Shopify product whose description includes one of those keywords.
4. After the Shopify product webhook runs, the matching keywords should appear on the product as tags.

## How it works

- Merchants manage approved keywords in the embedded app UI.
- Keywords are stored per shop using the `allowedTag` model.
- Shopify product create and update actions call [`api/models/shopifyProduct/utils.ts`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/api/models/shopifyProduct/utils.ts).
- The helper strips HTML from the product description, extracts candidate words, and queries only matching `allowedTag` records for the current shop.
- Matching keywords are merged with the product's existing tags and written back to Shopify with `api.enqueue(shopify.graphql, ...)` so the write can be retried safely in the background.

This keeps the app's behavior simple while avoiding a full scan of every allowed tag on each Shopify product webhook.

## Key files

- [`shopify.app.toml`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/shopify.app.toml): Shopify app configuration and scopes
- [`web/routes/_app._index.tsx`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/web/routes/_app._index.tsx): Embedded app UI for managing allowed tags
- [`api/models/allowedTag/schema.gadget.ts`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/api/models/allowedTag/schema.gadget.ts): Merchant-defined keyword model
- [`api/models/shopifyProduct/actions/create.ts`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/api/models/shopifyProduct/actions/create.ts): Trigger for new Shopify products
- [`api/models/shopifyProduct/actions/update.ts`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/api/models/shopifyProduct/actions/update.ts): Trigger for product description changes
- [`api/models/shopifyProduct/utils.ts`](/Users/gadget/Projects/templates/shopify/product-tagger-public-template/api/models/shopifyProduct/utils.ts): Keyword matching and Shopify tag application logic
