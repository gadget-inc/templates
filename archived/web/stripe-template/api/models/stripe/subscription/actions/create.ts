import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Move this to the subscription creation topic handler
  const user = await api.user.maybeFindFirst({
    filter: { stripeCustomerId: { equals: record.customer } },
    select: { id: true },
  });
  
  if (user) {
    // @ts-ignore
    record.user = {
      _link: user.id,
    };
  }
};

export const options: ActionOptions = {
  actionType: "create",
};
