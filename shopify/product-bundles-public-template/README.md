# Customized Bundles

## Core Purpose

This app enables Shopify merchants to create, manage, and sell product bundles. It allows merchants to group several individual product variants into a single, purchasable unit, offering curated packages to customers and increasing the average order value.

## Key Functionality

The app provides an admin interface for merchants to define a product variant as a "bundle" and associate other product variants as its components, each with a specified quantity. A bundle is modeled as a Shopify product whose variant has `requiresComponents: true` and a set of component variants stored in metafields. A Shopify Cart Transform Function expands the bundle into its individual component products at add-to-cart time, so inventory is tracked correctly and fulfillment stays seamless. Bundle data in Gadget is kept in sync with Shopify via webhooks, and bundle mutations run as background actions for reliability under slow Shopify responses.

## Setup

Follow these steps to get the template working:

1. [Connect to Shopify](https://docs.gadget.dev/guides/plugins/shopify/quickstart) using the built-in Shopify plugin.

2. Sync the code locally using `ggt` ([Gadget CLI](https://docs.gadget.dev/reference/ggt)).

3. Run `shopify app dev` so the Function runs on the dev storefront and checkout.

4. Create a bundle and add it to you cart in the storefront to test the Function.

## Key features

- Models

  - `bundleComponent`: Links a bundle variant to one of its component variants with a quantity. Each record belongs to `shopifyShop`, `bundleVariant` (the parent bundle's `shopifyProductVariant`), and `productVariant` (the component `shopifyProductVariant`).
  - `shopifyProduct` / `shopifyProductVariant`: Standard Shopify-synced models. A bundle is a `shopifyProduct` whose variant has `requiresComponents: true`; the variant carries the `isBundle`, `componentReference`, and `productVariantQuantities` metafields.

- Bundle Global Actions (under `api/actions/bundle/`)

  - `create` / `update` / `delete`: Enqueues `process` actions and hooks into the managed Shopify rate limit controller.
  - `processCreate`: Creates the Shopify product, updates the variant with bundle metafields and `requiresComponents`, publishes it to the Online Store, and creates the matching `bundleComponent` records.
  - `processUpdate`: Diffs supplied components against existing `bundleComponent` rows (create/update/delete), refreshes the `componentReference` metafield if the set of variants changed, and syncs component quantities.
  - `processDelete`: Deletes the `bundleComponent` rows, removes the `shopifyProduct`, and deletes the product in Shopify.

- Other Global Actions

  - `syncBundleComponentQuantities`: Writes the current component quantity map to the `productVariantQuantities` metafield via `metafieldsSet`. Called from `processUpdate` and when a component's quantity changes.
  - `scheduledShopifySync`: Daily scheduled action that runs `globalShopifySync` for all sync-only models across connected shops.

- Frontend (`web/routes/`)
- 
  - `_app._index.tsx`: Lists bundles (paginated, 20 per page) with search. Queries `shopifyProduct` filtered by `hasVariantsThatRequiresComponents`.
  - `_app.bundle.($id).tsx`: Create/edit a bundle — title, description, status, price, and components with quantities.

- Extension (`extensions/bundle/`)

  - Shopify Cart Transform Function that expands a bundle variant into its component line items at cart time, using the `componentReference` and `productVariantQuantities` metafields

## Relevant Shopify docs:

- [metafieldDefinitionCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldDefinitionCreate): Used to create the `isBundle`, `componentReference`, and `productVariantQuantities` metafield definitions on product variants
- [cartTransformCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/cartTransformCreate): Registers the Cart Transform function on install
- [publications](https://shopify.dev/docs/api/admin-graphql/latest/queries/publications): Fetches sales channels to find the `Online Store` publication
- [productCreate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate): Creates the bundle product (with `claimOwnership.bundles: true`)
- [productVariantsBulkUpdate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productVariantsBulkUpdate): Sets the bundle variant's price, `requiresComponents`, and bundle metafields
- [publishablePublish](https://shopify.dev/docs/api/admin-graphql/latest/mutations/publishablePublish): Publishes the bundle product to the Online Store
- [productDelete](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productDelete): Deletes the underlying Shopify product when a bundle is deleted
- [metafieldsSet](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet): Updates component quantities in the `productVariantQuantities` metafield