import pRetry from "p-retry";
import { logger } from "gadget-server";

export default async (url, token) => {
  url.searchParams.append("access_token", token);

  return await pRetry(
    async () => {
      const response = await fetch(url);
      if (response.status != 200) {
        logger.warn(
          { url, status: response.status, body: await response.text() },
          "unexpected response from instagram"
        );
        throw new Error(
          `Got unexpected status code from instagram: ${response.status}`
        );
      }

      return await response.json();
    },
    { retries: 6, minTimeout: 1000, factor: 3 }
  );
};
