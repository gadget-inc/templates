# Product Tagger

## Core purpose

This app allows Shopify merchants to create and manage a curated list of "allowed tags" that can be applied to their products. Rather than letting merchants use any random tags, it provides a controlled tagging system where only pre-approved keywords can be used as product tags.

## Key functionality

Merchants can define a set of approved keywords through the `allowedTag` model (each tag must be unique per shop). The app syncs with their Shopify product catalog automatically, giving them visibility into their products within the app interface. The `writeToShopify` action is used to write tag data back to Shopify, applying the approved tags to products based on merchant selections and product description. The product tagging operation is performed automatically when the product description is changed.
