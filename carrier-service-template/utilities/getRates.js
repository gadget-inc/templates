import { logger } from "gadget-server";

const formatAddresses = (addresses) => {
  const arr = [];
  for (const address of Object.values(addresses)) {
    if (address) {
      arr.push(address);
    }
  }
  return arr;
};

export default async ({ destination, origin, packages, accessToken }) => {
  try {
    const res = await fetch(
      process.env.NODE_ENV === "development"
        ? "https://apis-sandbox.fedex.com/rate/v1/rates/quotes"
        : "https://apis.fedex.com/rate/v1/rates/quotes",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          accountNumber: {
            value: process.env.FEDEX_ACCOUNT_NUMBER,
          },
          requestedShipment: {
            shipper: {
              address: {
                streetLines: formatAddresses({
                  address1: origin.address1,
                  address2: origin.address2,
                  address3: origin.address3,
                }),
                city: origin.city,
                stateOrProvinceCode: origin.province,
                postalCode: origin.postal_code,
                countryCode: origin.country,
              },
            },
            recipient: {
              address: {
                streetLines: formatAddresses({
                  address1: destination.address1,
                  address2: destination.address2,
                  address3: destination.address3,
                }),
                city: destination.city,
                stateOrProvinceCode: destination.province,
                postalCode: destination.postal_code,
                countryCode: destination.country,
              },
            },
            pickupType: "DROPOFF_AT_FEDEX_LOCATION",
            requestedPackageLineItems: packages,
            rateRequestType: ["LIST", "INCENTIVE", "ACCOUNT", "PREFERRED"],
          },
        }),
      }
    );

    const result = await res.json();

    return result.output.rateReplyDetails || [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
