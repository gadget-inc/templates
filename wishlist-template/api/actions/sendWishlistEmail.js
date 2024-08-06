import { SendWishlistEmailGlobalActionContext } from "gadget-server";
import React from "react";
import { render } from "@react-email/render";
import { Email } from "../utilities";
import { DateTime } from "luxon";
import { default as CC } from "currency-converter-lt2";

/**
 * @param { SendWishlistEmailGlobalActionContext } context
 */
export async function run({ params, logger, api, connections, emails }) {
  const {
    customer: {
      id,
      email,
      firstName,
      lastName,
      updateFrequencyOverride,
      sendUpdateAt,
      currency,
      shop: {
        customerEmail,
        name: shopName,
        defaultUpdateFrequency,
        currency: shopCurrency,
      },
    },
  } = params;

  let wishlistItems = await api.wishlistItem.findMany({
    first: 250,
    filter: {
      customer: {
        equals: id,
      },
    },
    select: {
      id: true,
      variant: {
        id: true,
        title: true,
        compareAtPrice: true,
        deleted: true,
        productImage: {
          source: true,
          alt: true,
        },
        product: {
          title: true,
        },
      },
    },
  });

  let allWishlistItems = wishlistItems;

  while (wishlistItems.hasNextPage) {
    wishlistItems = await wishlistItems.nextPage();
    allWishlistItems = allWishlistItems.concat(wishlistItems);
  }

  const changes = {
    removed: {},
    onSale: {},
  };
  let count = 0;

  const currencyConverter = new CC({ from: shopCurrency, to: currency });

  for (const {
    variant: {
      id: variantId,
      title,
      deleted,
      compareAtPrice,
      price,
      productImage: { source, alt },
      product: { title: productTitle },
    },
  } of allWishlistItems) {
    if (deleted) {
      count++;
      if (!changes.removed[variantId]) {
        changes.removed[variantId] = {
          id: variantId,
          title,
          productTitle,
          image: {
            source,
            alt,
          },
        };
      }
    } else if (compareAtPrice) {
      count++;

      if (!changes.onSale[variantId]) {
        changes.onSale[variantId] = {
          id: variantId,
          title,
          productTitle,
          price: parseFloat(price)
            ? currencyConverter.convert(parseFloat(price))
            : 0,
          compareAtPrice: parseFloat(compareAtPrice)
            ? currencyConverter.convert(parseFloat(compareAtPrice))
            : 0,
          image: {
            source,
            alt,
          },
        };
      }
    }
  }

  await emails.sendMail({
    from: customerEmail,
    to: email,
    subject: `${shopName} wishlist update`,
    html: render(
      <Email
        name={
          `${firstName || ""} ${lastName || ""}`.trim() || "cherished customer"
        }
        onSale={changes.onSale?.values()?.splice(0, 3)}
        removed={changes.removed?.values()?.splice(0, 3)}
        count={count}
      />
    ),
  });

  const frequency = updateFrequencyOverride || defaultUpdateFrequency;
  let nextDate;

  switch (frequency) {
    case "weekly":
      nextDate = DateTime.fromJSDate(new Date(sendUpdateAt))
        .plus({ weeks: 1 })
        .toJSDate();
      break;
    case "monthly":
      nextDate = DateTime.fromJSDate(new Date(sendUpdateAt))
        .plus({ months: 1 })
        .toJSDate();
      break;
    case "quarterly":
      nextDate = DateTime.fromJSDate(new Date(sendUpdateAt))
        .plus({ months: 3 })
        .toJSDate();
      break;
    default:
      break;
  }

  await api.internal.shopifyCustomer.update(id, {
    sendUpdateAt: nextDate,
  });
}

export const params = {
  customer: {
    type: "object",
    properties: {
      id: { type: "string" },
      email: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      currency: { type: "string" },
      updateFrequencyOverride: { type: "string" },
      sendUpdateAt: { type: "string" },
      shop: {
        type: "object",
        properties: {
          customerEmail: { type: "string" },
          name: { type: "string" },
          defaultUpdateFrequency: { type: "string" },
          currency: { type: "string" },
        },
      },
    },
  },
};
