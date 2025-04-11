export const run: ActionRun = async ({ params, logger, api, connections }) => {
  return !!(await api.movie.maybeFindFirst());
};
