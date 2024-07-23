export default (activeSubscription) => {
  let cappedAmount = 0;

  for (const lineItem of activeSubscription.lineItems) {
    if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
      cappedAmount = parseFloat(
        lineItem.plan.pricingDetails.cappedAmount.amount
      );
      break;
    }
  }

  return cappedAmount;
};
