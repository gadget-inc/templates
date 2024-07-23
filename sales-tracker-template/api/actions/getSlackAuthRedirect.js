import { GetSlackAuthRedirectGlobalActionContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";

/**
 * @param { GetSlackAuthRedirectGlobalActionContext } context
 *
 * @returns { state: string, id: string, redirectURI: string } An object with Slack OAuth specific data
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

  return `https://slack.com/oauth/v2/authorize?scope=${process.env.GADGET_PUBLIC_SLACK_SCOPES}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${currentAppUrl}slack/callback&state=${encodedString}`;
}

export const options = { triggers: { api: true } }