import { DateTime } from "luxon";
import type { Changes } from "../utilities/types";
import { renderEmail } from "../utilities";
import type { Customer } from "./startCustomerUpdates";

type ImageField = {
  id: string;
  width: number;
  height: number;
  originalSrc: string;
};

export const run: ActionRun = async ({
  params,
  logger,
  api,
  connections,
  emails,
}) => {
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
  } = params as {
    customer: Customer;
  };

  // Find all wishlist items for the customer
  let wishlistItems = await api.wishlistItem.findMany({
    first: 250,
    filter: {
      customerId: {
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
          media: {
            edges: {
              node: {
                image: true,
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
    allWishlistItems.push(...wishlistItems);
  }

  const changes: Changes = {
    removed: {},
    onSale: {},
  };
  let count = 0;

  // Loop through all the wishlist items to build the current state
  for (const { variant } of allWishlistItems) {
    if (
      !variant ||
      !variant?.title ||
      !variant?.price ||
      !variant?.product?.title
    )
      continue;

    const imageNode = variant.product?.media?.edges?.[0]?.node;

    if (
      !imageNode ||
      !imageNode?.alt ||
      !(imageNode?.image as ImageField).originalSrc
    )
      continue;

    if (variant.deleted) {
      count++;

      if (!changes.removed[variant.id]) {
        changes.removed[variant.id] = {
          id: variant.id,
          title: variant.title,
          productTitle: variant.product?.title,
          image: {
            source: (imageNode?.image as ImageField)?.originalSrc ?? "",
            alt: imageNode.alt,
          },
        };
      }
    } else if (variant.compareAtPrice) {
      count++;

      if (!changes.onSale[variant.id]) {
        changes.onSale[variant.id] = {
          id: variant.id,
          title: variant.title,
          productTitle: variant.product?.title,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          image: {
            source: (imageNode?.image as ImageField)?.originalSrc ?? "",
            alt: imageNode.alt,
          },
        };
      }
    }
  }

  // Send the email to the customer
  await emails.sendMail({
    to: email,
    subject: `${shopName} wishlist update`,
    html: await renderEmail({
      type: "wishlist",
      changes,
      count,
      firstName,
      lastName,
    }),
  });

  // Update the customer's sendUpdateAt date
  const frequency = updateFrequencyOverride || defaultUpdateFrequency;
  let nextDate;

  if (!sendUpdateAt) throw new Error("sendUpdateAt is required");

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
};

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
