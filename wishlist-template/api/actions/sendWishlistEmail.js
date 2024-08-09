import { SendWishlistEmailGlobalActionContext } from "gadget-server";
import React from "react";
import { render } from "@react-email/render";
import { Email } from "../utilities";
import { DateTime } from "luxon";

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
      shop: { name: shopName, defaultUpdateFrequency },
    },
  } = params;

  // Find all wishlist items for the customer
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
        price: true,
        product: {
          title: true,
          images: {
            edges: {
              node: {
                source: true,
                alt: true,
              },
            },
          },
        },
      },
    },
  });

  let allWishlistItems = wishlistItems;

  // Paginate if there are more than 250 wishlist items
  while (wishlistItems.hasNextPage) {
    wishlistItems = await wishlistItems.nextPage();
    allWishlistItems = allWishlistItems.concat(wishlistItems);
  }

  const changes = {
    removed: {},
    onSale: {},
  };
  let count = 0;

  // Loop through all the wishlist items to build the current state
  for (const {
    variant: {
      id: variantId,
      title,
      deleted,
      compareAtPrice,
      price,
      product: { title: productTitle, images },
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
            source: images[0]?.node?.source,
            alt: images[0]?.node?.alt,
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
          price,
          compareAtPrice,
          image: {
            source: images[0]?.node?.source,
            alt: images[0]?.node?.alt,
          },
        };
      }
    }
  }

  // Send the email to the customer
  await emails.sendMail({
    to: email,
    subject: `${shopName} wishlist update`,
    html: render(
      <Email
        name={
          `${firstName || ""} ${lastName || ""}`.trim() || "cherished customer"
        }
        onSale={Object.values(changes.onSale)?.splice(0, 3)}
        removed={Object.values(changes.removed)?.splice(0, 3)}
        count={count}
      />
    ),
  });

  // Update the customer's sendUpdateAt date
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
      updateFrequencyOverride: { type: "string" },
      sendUpdateAt: { type: "string" },
      wishlistCount: { type: "number" },
      shop: {
        type: "object",
        properties: {
          name: { type: "string" },
          defaultUpdateFrequency: { type: "string" },
        },
      },
    },
  },
};
