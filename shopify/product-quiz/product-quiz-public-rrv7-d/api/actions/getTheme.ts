export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const shopify = connections.shopify.current;

  if (!shopify) {
    throw new Error("No current Shopify connection context");
  }

  const response = await shopify.graphql(`
    query {
      themes(first: 1, roles: [MAIN]) {
        nodes {
          name
          id
          files (first: 250, filenames: ["templates/*.json"]) {
            nodes {
              filename
            }
          }
        }
      }
    }
  `);

  logger.info({ response }, "response");

  const { themes } = response;
  const theme = {
    onlineStore2: true,
    name: themes.nodes[0].name,
    id: themes.nodes[0].id.split("/").pop(),
  };

  if (!themes.nodes[0].files.nodes.length) {
    theme.onlineStore2 = false;
  }

  return theme;
};
