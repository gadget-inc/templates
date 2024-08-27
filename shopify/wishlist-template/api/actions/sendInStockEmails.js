import { SendInStockEmailsGlobalActionContext } from "gadget-server";
import { InStockEmail } from "../utilities";
import { render } from "@react-email/render";
import React from "react";

/**
 * @param { SendInStockEmailsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections, emails }) {
  const {
    customers,
    variant: { id, title },
    productId,
    shopId,
  } = params;

  const [shop, product] = await Promise.all([
    api.shopifyShop.findOne(shopId, {
      select: {
        name: true,
        domain: true,
      },
    }),
    api.shopifyProduct.findOne(productId, {
      select: {
        handle: true,
        title: true,
      },
    }),
  ]);

  for (const customer of customers) {
    await emails.sendMail({
      to: customer,
      subject: `Your wishlist item is now in stock!`,
      html: render(
        <InStockEmail
          {...{
            productTitle: product?.title,
            title,
            variantURL: `https://${shop?.domain}/products/${product?.handle}?variant=${id}`,
            name: shop?.name,
          }}
        />
      ),
    });
  }
}

export const params = {
  customers: {
    type: "array",
    items: {
      type: "string",
    },
  },
  variant: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      title: {
        type: "string",
      },
    },
  },
  shopId: {
    type: "string",
  },
  productId: {
    type: "string",
  },
};
