import { useAction, useFindMany } from "@gadgetinc/react";
import { useCallback, useState, useEffect } from "react";
import { api } from "../api";
import WishlistItemCard from "./WishlistItemCard.jsx";
import {
  BlockStack,
  Button,
  Icon,
  InlineStack,
  Modal,
  useI18n,
  Tooltip,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";
import StyledSpinner from "./StyledSpinner.js";

const NUM_ON_PAGE = 5;

export default ({ id, name }: { id: string; name: string }) => {
  // A cursor for the pagination of the wishlist items
  const [cursor, setCursor] = useState<{
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }>({ first: NUM_ON_PAGE });
  const { ui } = useApi();

  // Formatting for the customer's currency
  const { formatCurrency } = useI18n();

  // Hook for deleting a wishlist
  const [{ data: deletionData, fetching: fetchingDeletion }, deleteWishlist] =
    useAction(api.wishlist.delete);

  // Fetching wishlist items for the current wishlist
  const [
    {
      data: wishlistItems,
      fetching: fetchingWishlistItems,
      error: errorFetchingWishlistItems,
    },
  ] = useFindMany(api.wishlistItem, {
    filter: {
      wishlistId: {
        equals: id,
      },
    },
    select: {
      id: true,
      variant: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true,
        inventoryQuantity: true,
        deleted: true,
        product: {
          title: true,
          status: true,
          handle: true,
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
    ...cursor,
    live: true,
  });

  // Callback for deleting a wishlist
  const handleDelete = useCallback(async () => {
    await deleteWishlist({ id });
    ui.overlay.close(`${id}-wishlist-modal`);
  }, [id]);

  // Callback for getting the previous page of wishlist items
  const getPreviousPage = useCallback(() => {
    setCursor({ last: NUM_ON_PAGE, before: wishlistItems?.startCursor });
  }, [wishlistItems]);

  // Callback for getting the next page of wishlist items
  const getNextPage = useCallback(() => {
    setCursor({ first: NUM_ON_PAGE, after: wishlistItems?.endCursor });
  }, [wishlistItems]);

  // useEffect for showing an error if there's an error fetching wishlist items
  useEffect(() => {
    if (!fetchingWishlistItems && errorFetchingWishlistItems) {
      console.error(errorFetchingWishlistItems);
    }
  }, [fetchingWishlistItems, errorFetchingWishlistItems]);

  // If fetching wishlist items, show a spinner
  if (fetchingWishlistItems) {
    return (
      <Modal title={name} padding>
        <StyledSpinner />
      </Modal>
    );
  }

  return (
    <Modal title={name} id={`${id}-wishlist-modal`} padding>
      <BlockStack>
        <BlockStack>
          {!wishlistItems?.length && <>No items</>}
          {wishlistItems?.map(({ id, variant }) => (
            <WishlistItemCard
              key={id}
              {...{
                id,
                variantId: variant?.id,
                title: variant?.title,
                price: formatCurrency(parseFloat(variant?.price ?? "0")),
                compareAtPrice:
                  variant?.compareAtPrice &&
                  formatCurrency(parseFloat(variant.compareAtPrice ?? "0")),
                deleted: variant?.deleted,
                productTitle: variant?.product?.title,
                status: variant?.product?.status,
                imageNode: variant?.product?.media?.edges?.[0]?.node,
                inventoryQuantity: variant?.inventoryQuantity,
                handle: variant?.product?.handle,
              }}
            />
          ))}
        </BlockStack>
        <InlineStack blockAlignment="center" inlineAlignment="end">
          <Button
            kind="plain"
            appearance="critical"
            onPress={handleDelete}
            loading={fetchingDeletion && !deletionData}
          >
            Delete wishlist
          </Button>
        </InlineStack>
        <InlineStack blockAlignment="center" inlineAlignment="center">
          <Button
            disabled={!wishlistItems?.hasPreviousPage}
            onPress={getPreviousPage}
            appearance="monochrome"
            kind="plain"
            overlay={
              wishlistItems?.hasPreviousPage && <Tooltip>Previous page</Tooltip>
            }
          >
            <Icon source="chevronLeft" appearance="monochrome" />
          </Button>
          <Button
            disabled={!wishlistItems?.hasNextPage}
            onPress={getNextPage}
            appearance="monochrome"
            kind="plain"
            overlay={wishlistItems?.hasNextPage && <Tooltip>Next page</Tooltip>}
          >
            <Icon source="chevronRight" appearance="monochrome" />
          </Button>
        </InlineStack>
      </BlockStack>
    </Modal>
  );
};
