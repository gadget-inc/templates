export default (rates) => {
  const ratesForShopify = [];
  for (const rate of rates) {
    ratesForShopify.push({
      currency: rate.ratedShipmentDetails[0].currency.toUpperCase(),
      total_price: rate.ratedShipmentDetails[0].totalNetCharge
        .toString()
        .replace(".", ""),
      service_name: rate.serviceName,
      service_code: rate.operationalDetail.serviceCode,
      description: rate.serviceDescription.description,
    });
  }

  return ratesForShopify;
};
