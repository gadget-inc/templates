import {
  applyParams,
  save,
  ActionOptions,
  SetToCurrentPlanActionContext,
} from "gadget-server";

/**
 * @param { SetToCurrentPlanActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
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
}

/**
 * @param { SetToCurrentPlanActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};
