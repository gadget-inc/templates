import { GetOAuthParamsGlobalActionContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";

/**
 * @param { GetOAuthParamsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections, currentAppUrl }) {
  const b64 = new Base64();
  const encodedString = b64.urlEncode(
    jwt.sign(
      { id: connections.shopify.currentShopId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
  );
  return {
    state: encodedString,
    id: process.env.SLACK_CLIENT_ID,
    redirectURI: `${currentAppUrl}slack/callback`,
  };
}
