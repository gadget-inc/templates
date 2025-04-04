import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
} from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

// This function has similar logic to the onSuccess function in the bundle delete action. This handles the case that a merchant deletes a bundle from the admin (products page).
export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  if (record.isBundle) {
    // If the product variant is a bundle, delete the bundle and its components
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
  }

  // Delete all bundle components associated with this product variant
  await api.internal.bundleComponent.deleteMany({
    filter: {
      productVariantId: {
        equals: record.id
      },
    },
  });
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: false },
};
