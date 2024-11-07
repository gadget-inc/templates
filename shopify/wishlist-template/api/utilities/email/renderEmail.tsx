import React from "react";
import { render } from "@react-email/render";
import WishlistEmail from "./WishlistEmail";
import InStockEmail from "./InStockEmail";
import type { OnSaleVariant, Payload, RemovedVariant } from "../types";

export default (type: "wishlist" | "inStock", payload: Payload) => {
  switch (type) {
    case "wishlist":
      const { changes, count, firstName, lastName } = payload;

      return render(
        <WishlistEmail
          name={
            `${firstName || ""} ${lastName || ""}`.trim() ||
            "cherished customer"
          }
          onSale={
            Object.values(changes.onSale)?.splice(0, 3) as OnSaleVariant[]
          }
          removed={
            Object.values(changes.removed)?.splice(0, 3) as RemovedVariant[]
          }
          count={count}
        />
      );

    case "inStock":
      const { product, shop, id, title } = payload;

      return render(
        <InStockEmail
          {...{
            productTitle: product?.title,
            title,
            variantURL: `https://${shop?.domain}/products/${product?.handle}?variant=${id}`,
            name: shop?.name,
          }}
        />
      );

    default:
      return "";
  }
};
