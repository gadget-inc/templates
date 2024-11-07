import { renderEmail } from "../utilities";

export const run: ActionRun = async ({
  params,
  logger,
  api,
  connections,
  emails,
}) => {
  const { customers, variant, productId, shopId } = params;

  if (!variant) {
    throw new Error("Variant is undefined");
  }

  const { id, title } = variant;

  const [shop, product] = await Promise.all([
    api.shopifyShop.findOne(shopId as string, {
      select: {
        name: true,
        domain: true,
      },
    }),
    api.shopifyProduct.findOne(productId as string, {
      select: {
        handle: true,
        title: true,
      },
    }),
  ]);

  if (customers) {
    for (const customer of customers) {
      await emails.sendMail({
        to: customer,
        subject: `Your wishlist item is now in stock!`,
        html: renderEmail({
          type: "inStock",
          product: {
            handle: product.handle ?? "",
            title: product.title ?? "",
          },
          title: title ?? "",
          id: id ?? "",
          shop: {
            name: shop.name ?? "",
            domain: shop.domain ?? "",
          },
        }),
      });
    }
  }
};

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
