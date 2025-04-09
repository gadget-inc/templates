# Customized bundles

This template has [setup instructions](template-setup).

This template allows merchants to create bundles with little effort. The Shopify app bridge resource picker is used to allow merchants to pick products/variants to be sold as a bundle.

GraphQL queries and mutations used:

- [metafieldDefinitionCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/metafieldDefinitionCreate): Used 3 times to create the metafields `isBundle`, `componentReference` and `productVariantQuantities`
- [cartTransformCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/cartTransformCreate): Creates the Cart Transform function on the store installing the application
- [publications](https://shopify.dev/docs/api/admin-graphql/2024-07/queries/publications): Fetches a list of publications (sales channels) for the store. This is used to specifically fetch the `Online Store` sales channel
- [productCreate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productCreate): Used when a bundle is created to set title, price, product status and description
- [productVariantUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productVariantUpdate): Used to set the components of the bundle and their quantities when a bundle is created or updated
- [publishablePublish](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/publishablePublish): Called on bundle creation to publish it to the `Online Store`
- [productUpdate](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/productUpdate): Used to update the title, price, status and description of the bundle
- [metafieldsSet](https://shopify.dev/docs/api/customer/2024-07/mutations/metafieldsSet): Used to modify the quantities of components in the bundle
