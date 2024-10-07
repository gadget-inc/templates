import { Server } from "gadget-server";

/**
 * Route plugin for webhook/*
 *
 * @param { Server } server - server instance to customize, with customizations scoped to descendant paths
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Server}
 */
export default async function (server) {
  server.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (_req, body, done) {
    done(null, body)
  });
}
