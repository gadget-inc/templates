import { Server } from "gadget-server";

export default async function (server: Server) {
  server.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    function (_req, body, done) {
      done(null, body);
    }
  );
}
