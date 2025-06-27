# Product Bundler

Core Purpose: This app enables Shopify merchants to create, manage, and sell product bundles. It allows merchants to group several individual product variants into a single, purchasable unit, offering curated packages to customers and increasing the average order value.

Key Functionality: The app provides an admin interface for merchants to define a product variant as a "bundle" and associate other product variants as its components, each with a specified quantity. This bundle data is synchronized with Shopify using metafields. When a customer adds a bundle to their cart, a Shopify Function automatically expands the bundle into its individual component products. This ensures that inventory is tracked correctly and that fulfillment processes are seamless. The app maintains a real-time sync with the merchant's product catalog and manages all bundle logic within the Shopify ecosystem.

Relevant Shopify docs:

- [metafieldDefinitionCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/metafieldDefinitionCreate): Used 3 times to create the metafields `isBundle`, `componentReference` and `productVariantQuantities`
- [cartTransformCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/cartTransformCreate): Creates the Cart Transform function on the store installing the application
- [publications](https://shopify.dev/docs/api/admin-graphql/2024-07/queries/publications): Fetches a list of publications (sales channels) for the store. This is used to specifically fetch the `Online Store` sales channel
- [productCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productCreate): Used when a bundle is created to set title, price, product status and description
- [productVariantUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productVariantUpdate): Used to set the components of the bundle and their quantities when a bundle is created or updated
- [publishablePublish](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/publishablePublish): Called on bundle creation to publish it to the `Online Store`
- [productUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productUpdate): Used to update the title, price, status and description of the bundle
- [metafieldsSet](https://shopify.dev/docs/api/customer/2024-07/mutations/metafieldsSet): Used to modify the quantities of components in the bundle
