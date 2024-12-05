import { RouteHandler } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";
import { slackClient } from "../../../utilities";

// Redirects the user the app's Shopify embedded UI (Overview page)
const route: RouteHandler = async ({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}) => {
  const { state, code }: { state: string; code: string } = request.query as {
    state: string;
    code: string;
  };

  const b64 = new Base64();
  const decodedString = b64.decode(state);
  const token = jwt.verify(
    decodedString,
    String(process.env.JWT_SECRET)
  ) as jwt.JwtPayload;

  /**
   * Getting the Slack access token using the temporary code returned from Slack
   *
   * Make sure to grab the SLACK_CLIENT_ID and SLACK_CLIENT_SECRET from your Slack app
   */
  const res = await slackClient.oauth.v2.access({
    client_id: String(process.env.SLACK_CLIENT_ID),
    client_secret: String(process.env.SLACK_CLIENT_SECRET),
    code: code,
    redirect_uri: `${currentAppUrl}slack/callback`,
  });

  // Updating the shopifyShop record
  const shop = await api.internal.shopifyShop.update(token.id, {
    slackAccessToken: res.access_token,
    slackScopes: res.scope?.split(","),
    hasSlackAccessToken: true,
  });

  // Redirecting to the storefront
  await reply
    .code(302)
    .redirect(`https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`);
};

export default route;
