import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  const bundle = await api.bundle.maybeFindFirst({
    filter: {
      bundleVariantId: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (bundle) {
    await api.internal.bundle.delete(bundle.id);
  }

  await api.internal.bundleComponent.deleteMany({
    filter: {
      productVariantId: {
        equals: record.id,
      },
    },
  });
};

export const options: ActionOptions = { actionType: "delete" };
