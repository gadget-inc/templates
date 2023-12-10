import { RouteContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";
import { slackClient } from "../../utilities";

/**
 * Route handler for install slack
 *
 * @param { RouteContext } route This is the endpoint for the end of the Slack OAuth flow
 * @see https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 * @returns Redirects the user the app's Shopify embedded UI (Overview page)
 */
export default async function route({
  request,
  reply,
  api,
  logger,
  connections,
  currentAppUrl,
}) {
  const b64 = new Base64();
  const decodedString = b64.decode(request.query.state);
  const token = jwt.verify(decodedString, process.env.JWT_SECRET);

  // Getting the Slack access token using the temporary code returned from Slack
  const res = await slackClient.oauth.v2.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: request.query.code,
    redirect_uri: `${currentAppUrl}slack/callback`,
  });

  // Updating the shopifyShop record
  const shop = await api.internal.shopifyShop.update(
    token.id,
    {
      slackAccessToken: res.access_token,
      slackScopes: res.scope.split(","),
      hasSlackAccessToken: true,
    },
    {
      select: {
        domain: true,
        installedViaApiKey: true,
      },
    }
  );

  // Redirecting to the storefront
  await reply
    .code(302)
    .redirect(`https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`);
}
