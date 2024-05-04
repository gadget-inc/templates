import {
  ActionOptions,
  GetPlansAtShopCurrencyGlobalActionContext,
} from "gadget-server";
import { convertCurrency } from "../../utilities";

/**
 * @param { GetPlansAtShopCurrencyGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  const response = [];

  const shop = await api.shopifyShop.maybeFindOne(
    connections.shopify.currentShopId,
    {
      select: {
        currency: true,
      },
    }
  );

  if (!shop) throw new Error("No Shopify context found");

  const plans = await api.plan.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      pricePerOrder: true,
      trialDays: true,
      currency: true,
      cappedAmount: true,
    },
    sort: {
      pricePerOrder: "Descending", // Prices from lowest to highest
    },
  });

  if (!plans?.length) throw new Error("Must have plans to run this action");

  for (const plan of plans) {
    const tempObj = {
      id: plan.id,
      currency: shop.currency,
      name: plan.name,
      description: plan.description,
      trialDays: plan.trialDays,
      cappedAmount: plan.cappedAmount,
    };

    if (plan.pricePerOrder) {
      response.push({
        pricePerOrder: (
          await convertCurrency(
            plan.currency,
            shop.currency,
            plan.pricePerOrder
          )
        ).toFixed(2),
        ...tempObj,
      });
    } else {
      response.push({
        ...tempObj,
        pricePerOrder: 0,
      });
    }
  }

  return response;
}

/** @type { ActionOptions } */
export const options = {};
