import { logger } from "gadget-server";

const development = process.env.NODE_ENV === "development";

/**
 * FedEx no longer allows you to send in dynamic test data, so we have to use a static request body for testing. The test rate was generated using the downloadable Postman collection from the FedEx developer portal.
 *
 * Please look at the following links for more information:
 * https://developer.fedex.com/api/en-us/guides/sandboxvirtualization.html
 * https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html (Postman collection - "JSON API COLLECTION" button)
 *
 */
const devRequest = JSON.stringify({
  accountNumber: {
    value: process.env.FEDEX_ACCOUNT_NUMBER,
  },
  requestedShipment: {
    shipper: {
      address: {
        postalCode: "m1m1m1",
        countryCode: "CA",
      },
    },
    recipient: {
      address: {
        postalCode: "V5K1A1",
        countryCode: "CA",
      },
    },
    pickupType: "DROPOFF_AT_FEDEX_LOCATION",
    serviceType: "STANDARD_OVERNIGHT",
    packagingType: "FEDEX_PAK",
    requestedPackageLineItems: [
      {
        weight: {
          units: "KG",
          value: 1,
        },
      },
    ],
    rateRequestType: ["LIST", "ACCOUNT"],
  },
});

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
      development
        ? "https://apis-sandbox.fedex.com/rate/v1/rates/quotes"
        : "https://apis.fedex.com/rate/v1/rates/quotes",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: development
          ? devRequest
          : JSON.stringify({
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

    if (development) logger.info(result, "getRates.js");

    return result?.output?.rateReplyDetails || [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
