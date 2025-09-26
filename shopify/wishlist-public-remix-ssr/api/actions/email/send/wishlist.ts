import pMap from "p-map";
import { DateTime } from "luxon";
import type {
  Changes,
  OnSaleVariant,
  RemovedVariant,
} from "../../../utils/types";
import WishlistEmail from "../../../utils/email/Wishlist";

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
  try {
    logger.info("Starting wishlist email processing");

    let customers = await api.shopifyCustomer.findMany({
      first: 250,
      filter: {
        emailMarketingConsent: {
          matches: {
            state: "subscribed",
          },
        },
        sendUpdateAt: {
          lessThanOrEqual: new Date(),
        },
        email: {
          isSet: true,
        },
        updateFrequencyOverride: {
          notEquals: "unsubscribed",
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        wishlistCount: true,
        sendUpdateAt: true,
        updateFrequencyOverride: true,
        shop: {
          name: true,
          defaultUpdateFrequency: true,
        },
      },
    });

    const allCustomers = [...customers];

    while (customers.hasNextPage) {
      customers = await customers.nextPage();
      allCustomers.push(...customers);
    }

    if (!allCustomers.length) {
      logger.info("No customers found for wishlist email processing");
      return;
    }

    logger.info(
      `Found ${allCustomers.length} customers for wishlist email processing`
    );

    await pMap(
      allCustomers,
      async ({
        id,
        email,
        firstName,
        lastName,
        updateFrequencyOverride,
        sendUpdateAt,
        shop,
      }) => {
        try {
          logger.info(`Processing customer ${id} (${email})`);
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

          const allWishlistItems = [...wishlistItems];

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

          // Only send email if there are changes
          if (count > 0 && email) {
            await emails.sendMail({
              to: email,
              subject: `${shop?.name || "Store"} wishlist update`,
              html: await WishlistEmail({
                name:
                  `${firstName || ""} ${lastName || ""}`.trim() ||
                  "cherished customer",
                onSale: Object.values(changes.onSale)?.splice(
                  0,
                  3
                ) as OnSaleVariant[],
                removed: Object.values(changes.removed)?.splice(
                  0,
                  3
                ) as RemovedVariant[],
                count,
              }),
            });
            logger.info(
              {
                email,
                count,
              },
              "Sent wishlist email to customer"
            );
          } else {
            logger.info(
              {
                email,
              },
              "No changes found for customer, skipping email"
            );
          }

          // Update the customer's sendUpdateAt date only if there were changes
          if (count > 0) {
            const frequency =
              updateFrequencyOverride || shop?.defaultUpdateFrequency;
            let nextDate;

            if (!sendUpdateAt) {
              logger.error(`sendUpdateAt is required for customer ${id}`);
              return;
            }

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
                logger.warn(
                  `Unknown frequency '${frequency}' for customer ${id}`
                );
                return;
            }

            if (nextDate) {
              await api.internal.shopifyCustomer.update(id, {
                sendUpdateAt: nextDate,
              });
            }
          }
        } catch (error) {
          logger.error(error);
          // Continue processing other customers even if one fails
        }
      },
      { concurrency: 5 }
    );

    logger.info("Completed wishlist email processing");
  } catch (error) {
    logger.error("Error in wishlist email processing:", error);
    throw error;
  }
};

export const options = {
  triggers: {
    scheduler: [{ cron: "*/5 * * * *" }],
  },
};
