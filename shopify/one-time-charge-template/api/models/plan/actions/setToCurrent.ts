import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);

  // (Maybe) Fetches old current plan
  const current = await api.plan.maybeFindFirst({
    filter: {
      current: {
        equals: true,
      },
    },
    select: {
      id: true,
    },
  });

  // Sets the old plan's current flag to false
  if (current) {
    await api.plan.update(current.id, {
      current: false,
    });
  }

  record.current = true;

  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: true },
};
