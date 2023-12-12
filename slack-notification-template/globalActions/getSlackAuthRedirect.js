import { GetOAuthParamsGlobalActionContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";

/**
 * @param { GetOAuthParamsGlobalActionContext } context
 *
 * A global action that creates a redirect URL that points to the Slack auth start route
 *
 * Make sure to fill out the environment variables.
 *
 * JWT_SECRET: A UUID
 * SLACK_SCOPES: channels:read,channels:manage,channels:join,chat:write
 * SLACK_CLIENT_ID: The client id found on the "Basic Information" page of your Slack app
 * SLACK_CLIENT_SECRET: The client secret found on the "Basic Information" page of your Slack app
 */
export async function run({ params, logger, api, connections, currentAppUrl }) {
  const b64 = new Base64();

  let missingConfig;

  if (!process.env.JWT_SECRET) missingConfig = "JWT_SECRET";
  if (!process.env.SLACK_CLIENT_ID) missingConfig = "SLACK_CLIENT_ID";
  if (!process.env.SLACK_SCOPES) missingConfig = "SLACK_SCOPES";

  if (missingConfig) {
    throw new Error(
      `INVALID CONFIG: Missing environment variable - ${missingConfig}`
    );
  }

  const encodedString = b64.urlEncode(
    jwt.sign(
      { id: connections.shopify.currentShopId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
  );

  return `https://slack.com/oauth/v2/authorize?scope=${process.env.SLACK_SCOPES}&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${currentAppUrl}slack/callback&state=${encodedString}`;
}
