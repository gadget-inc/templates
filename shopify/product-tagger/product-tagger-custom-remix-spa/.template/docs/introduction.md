# Automated product tagger architecture

This template automates the process of assigning tags to products added to a Shopify store's inventory by checking the product's description against a list of keywords defined by the merchant in an embedded Admin UI.

The `allowedTag` and `shopifyProduct` models manage tag associations and incoming Shopify product information. The frontend has `ShopPage.jsx`, enabling users to add/remove keywords within the app's database. Access control is granted to `shopify-app-users` for `allowedTag` operations, ensuring secure administration that prevents multiple shops from being able to access each other's data.
