import { RouteContext } from "gadget-server";

/**
 * Route handler for GET hello
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  // This route file will respond to an http request -- feel free to edit or change it!
  // For more information on HTTP routes in Gadget applications, see https://docs.gadget.dev/guides/http-routes

  await reply.type("application/json").send({"hello": "world"})
}
