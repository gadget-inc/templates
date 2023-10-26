import { RouteContext } from "gadget-server";
import { default as jwt } from "jsonwebtoken";
import { Base64 } from "base64-string";
import { slackClient } from "../../utilities";

/**
 * Route handler for install slack
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
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

  const res = await slackClient.oauth.v2.access({
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: request.query.code,
    redirect_uri: `${currentAppUrl}slack/callback`,
  });

  const shop = await api.shopifyShop.setSlackAccessToken(
    token.id,
    {
      slackAccessToken: res.access_token,
      slackScopes: res.scope.split(","),
    },
    {
      select: {
        domain: true,
        installedViaApiKey: true,
      },
    }
  );

  await reply
    .code(302)
    .redirect(`https://${shop.domain}/admin/apps/${shop.installedViaApiKey}`);
}
