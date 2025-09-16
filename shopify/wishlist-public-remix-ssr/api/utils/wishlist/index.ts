import { api } from "gadget-server";

export const metafieldUpdate = async ({
  shopId,
  customerId,
}: {
  shopId: string;
  customerId: string;
}) => {
  await api.enqueue(
    api.metadata.wishlist.metafield.update,
    {
      shopId,
      customerId,
    },
    {
      queue: {
        name: "wishlist-metafield-update",
        maxConcurrency: 4,
      },
    }
  );
};
