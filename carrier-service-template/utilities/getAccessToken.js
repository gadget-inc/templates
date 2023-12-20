import { logger } from "gadget-server";

export default async () => {
  try {
    let formBody = [];
    // Required details for requesting an access token from the Fedex API
    const details = {
      grant_type: "client_credentials",
      client_id: process.env.FEDEX_API_KEY,
      client_secret: process.env.FEDEX_SECRET_KEY,
    };
    for (const property in details) {
      // Looping over details to form and encoded string
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    // Requesting an access code from the Fedex (test) API
    const res = await fetch("https://apis-sandbox.fedex.com/oauth/token", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: formBody,
      method: "POST",
    });

    const result = await res.json()

    logger.info({ result }, "GET ACCESS TOKEN RESULT")

    return result.access_token;
  } catch (error) {
    logger.error(error, "ERROR GETTING ACCESS TOKEN CALL");
    return null;
  }
};
