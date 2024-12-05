import { RouteHandler } from "gadget-server";

const route: RouteHandler = async ({
  request,
  reply,
  api,
  logger,
  connections,
}) => {
  const { shop_id, charge_id } = request.query as {
    shop_id: string;
    charge_id: string;
  };

  const shop = await api.internal.shopifyShop.update(shop_id, {
    oneTimeChargeId: charge_id,
  });

  await reply.redirect(
    `https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`
  );
};

export default route;
