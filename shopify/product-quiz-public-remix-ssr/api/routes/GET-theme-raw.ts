import { RouteHandler } from "gadget-server";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Route handler for GET theme-files
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler = async ({
  request,
  reply,
  api,
  logger,
  connections,
}) => {
  const quizLiquidPath = path.join(
    process.cwd(),
    "extensions",
    "quiz",
    "blocks",
    "quiz.liquid"
  );
  const quizJsPath = path.join(
    process.cwd(),
    "extensions",
    "quiz",
    "assets",
    "quiz.js"
  );

  await reply.send({
    rawQuizPageLiquid: await readFile(quizLiquidPath, "utf-8"),
    rawProductQuizJs: await readFile(quizJsPath, "utf-8"),
  });
};

export default route;
