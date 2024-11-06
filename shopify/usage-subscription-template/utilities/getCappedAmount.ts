import { SubscriptionLineItems } from "../api/models/shopifyShop/actions/subscribe";

export default (lineItems: SubscriptionLineItems) => {
  let cappedAmount = 0;

  for (const lineItem of lineItems) {
    if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
      cappedAmount = parseFloat(
        lineItem.plan.pricingDetails.cappedAmount.amount
      );
      break;
    }
  }

  return cappedAmount;
};
