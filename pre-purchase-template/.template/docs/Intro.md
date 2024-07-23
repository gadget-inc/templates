# Template Architecture

[This template has setup instructions](template-setup).

This is a template for a Shopify pre-purchase product offer application. Merchants can select a product in an embedded admin app, and that product will be offered to buyers in the checkout.

A custom `savePrePurchaseProduct` action has been added to the `shopifyShop` model. This action is called from `web/routes/index.jsx` when a merchant (who has the `shopify-app-user` access role) selects a product and makes a request to Shopify to store the metafield.

The `productId` of the product to be offered is stored in a SHOP-owned metafield, stored in Gadget as `prePurchaseProduct` on the `shopifyShop` model, and this metafield is used as input to a [Shopify checkout UI extension](https://shopify.dev/docs/api/checkout-ui-extensions). The checkout UI extension code is contained in the `extensions` folder and must be copied to a Shopify CLI app to be run and tested.
