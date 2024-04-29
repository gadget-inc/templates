import {
  ActionOptions,
  GetBundleComponentsGlobalActionContext,
} from "gadget-server";

/**
 * @param { GetBundleComponentsGlobalActionContext } context
 */
export async function run({ params: { bundleId }, logger, api, connections }) {
  const bundle = await api.bundle.maybeFindOne(bundleId);

  if (!bundle) throw new Error(`Bundle with id ${bundleId} not found`);

  let bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundle: {
        equals: bundleId,
      },
    },
    first: 250,
    select: {
      id: true,
      variant: {
        id: true,
        title: true,
        productImage: {
          id: true,
          source: true,
        },
        product: {
          id: true,
          title: true,
        },
      },
    },
  });

  let allBundleComponents = bundleComponents;

  while (bundleComponents.hasNextPage) {
    bundleComponents = await bundleComponents.nextPage();
    allBundleComponents = allBundleComponents.concat(bundleComponents);
  }

  return allBundleComponents;
}

/** @type { ActionOptions } */
export const options = {
  bundleId: {
    type: "string",
    required: true,
  },
};
