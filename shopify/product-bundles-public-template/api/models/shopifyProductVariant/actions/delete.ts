import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, api }) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  await api.internal.bundleComponent.deleteMany({
    filter: {
      OR: [
        { bundleVariantId: { equals: record.id } },
        { productVariantId: { equals: record.id } },
      ],
    },
  });
};

export const options: ActionOptions = { actionType: "delete" };
