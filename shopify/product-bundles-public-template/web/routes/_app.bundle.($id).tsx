import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router";
import { api } from "../api";
import type { OutletContext } from "./_app";
import type { Route } from "./+types/_app.bundle.($id)";

type BundleComponentFormValue = {
  id?: string;
  productVariantId: string;
  quantity: number;
  productTitle: string;
  variantTitle: string;
  displayName: string;
};

type BundleStatus = "active" | "archived" | "draft";

type VariantDetails = {
  productTitle: string;
  variantTitle: string;
};

type PickerVariant = {
  id: string;
  title?: string;
  displayName?: string;
  product?: {
    title?: string;
  };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
type LoadedBundle = LoaderData["bundle"];

const stripShopifyGid = (gid: string) => gid.split("/").pop() ?? gid;

const isDefaultVariantTitle = (title?: string | null) => !title || title === "Default Title";

const formatBundleComponentLabel = (productTitle: string, variantTitle?: string | null) =>
  isDefaultVariantTitle(variantTitle) ? productTitle : `${productTitle} - ${variantTitle}`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const loadVariantMap = async (apiClient: Route.LoaderArgs["context"]["api"]) => {
  let variants = await apiClient.shopifyProductVariant.findMany({
    first: 250,
    select: {
      id: true,
      title: true,
      product: {
        title: true,
      },
    },
  });

  const variantMap: Record<string, VariantDetails> = {};

  for (const variant of variants) {
    variantMap[variant.id] = {
      productTitle: variant.product?.title || "Untitled product",
      variantTitle: variant.title || "Default Title",
    };
  }

  while (variants.hasNextPage) {
    variants = await variants.nextPage();

    for (const variant of variants) {
      variantMap[variant.id] = {
        productTitle: variant.product?.title || "Untitled product",
        variantTitle: variant.title || "Default Title",
      };
    }
  }

  return variantMap;
};

const loadBundle = async (apiClient: Route.LoaderArgs["context"]["api"], id?: string) => {
  if (!id) return null;

  return await apiClient.bundle.findOne(id, {
    select: {
      id: true,
      title: true,
      price: true,
      status: true,
      description: true,
      bundleComponents: {
        edges: {
          node: {
            id: true,
            quantity: true,
            productVariant: {
              id: true,
              title: true,
              product: {
                title: true,
              },
            },
          },
        },
      },
    },
  });
};

const buildInitialBundleComponents = (bundle: LoadedBundle): BundleComponentFormValue[] => {
  const nodes =
    bundle?.bundleComponents?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node?.productVariant?.id)) ?? [];

  return nodes.map((node) => {
    const productTitle = node.productVariant?.product?.title || "Untitled product";
    const variantTitle = node.productVariant?.title || "Default Title";

    return {
      id: node.id,
      productVariantId: node.productVariant.id,
      quantity: Number(node.quantity ?? 1),
      productTitle,
      variantTitle,
      displayName: formatBundleComponentLabel(productTitle, variantTitle),
    };
  });
};

const buildBundlePayload = (
  fields: {
    title: string;
    price: string;
    status: BundleStatus;
    description: string;
  },
  bundleComponents: BundleComponentFormValue[]
) => ({
  title: fields.title,
  price: Number(fields.price),
  status: fields.status,
  description: fields.description,
  bundleComponents: [
    {
      _converge: {
        values: bundleComponents.map((component) => ({
          ...(component.id ? { id: component.id } : {}),
          quantity: component.quantity,
          productVariant: {
            _link: component.productVariantId,
          },
        })),
      },
    },
  ],
});

const mapSelectedVariants = (
  selected: PickerVariant[],
  existingComponents: BundleComponentFormValue[],
  variantMap: Record<string, VariantDetails>
) => {
  const existingByVariantId = new Map(
    existingComponents.map((component) => [component.productVariantId, component] as const)
  );

  return selected.map((variant) => {
    const productVariantId = stripShopifyGid(variant.id);
    const existing = existingByVariantId.get(productVariantId);
    const fallback = variantMap[productVariantId];
    const variantTitle = variant.title || fallback?.variantTitle || "Default Title";
    const productTitle =
      variant.product?.title || existing?.productTitle || fallback?.productTitle || "Untitled product";

    return {
      id: existing?.id,
      productVariantId,
      quantity: existing?.quantity ?? 1,
      productTitle,
      variantTitle,
      displayName:
        variant.displayName ||
        existing?.displayName ||
        formatBundleComponentLabel(productTitle, variantTitle),
    };
  });
};

const removeBundleComponent = (
  bundleComponents: BundleComponentFormValue[],
  indexToRemove: number
) => bundleComponents.filter((_, index) => index !== indexToRemove);

const updateBundleComponentQuantity = (
  bundleComponents: BundleComponentFormValue[],
  indexToUpdate: number,
  quantity: number
) =>
  bundleComponents.map((component, index) =>
    index === indexToUpdate ? { ...component, quantity } : component
  );

export const loader = async ({ context, params }: Route.LoaderArgs) => {
  const { id } = params as { id?: string };
  const [bundle, variantMap] = await Promise.all([
    loadBundle(context.api, id),
    loadVariantMap(context.api),
  ]);

  return { bundle, variantMap };
};

export default function BundleEditor() {
  const shopify = useAppBridge();
  const { id } = useParams();
  const navigate = useNavigate();
  const { bundleCount, currency } = useOutletContext<OutletContext>();
  const { bundle, variantMap } = useLoaderData<typeof loader>();

  const [title, setTitle] = useState(bundle?.title ?? "");
  const [price, setPrice] = useState(bundle?.price?.toString() ?? "0");
  const [status, setStatus] = useState<BundleStatus>((bundle?.status as BundleStatus | undefined) ?? "draft");
  const [description, setDescription] = useState(bundle?.description ?? "");
  const [bundleComponents, setBundleComponents] = useState(() => buildInitialBundleComponents(bundle as LoadedBundle));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = async () => {
    const selectionIds = bundleComponents.map((component) => ({
      id: `gid://shopify/ProductVariant/${component.productVariantId}`,
    }));

    const selected = (await shopify.resourcePicker({
      type: "variant",
      multiple: true,
      action: selectionIds.length ? "add" : "select",
      selectionIds,
    })) as PickerVariant[] | undefined;

    if (!selected) return;

    setBundleComponents(mapSelectedVariants(selected, bundleComponents, variantMap));
  };

  const saveBundle = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload = buildBundlePayload({ title, price, status, description }, bundleComponents);

      if (id) {
        await api.bundle.update(id, payload);
      } else {
        await api.bundle.create(payload);
      }

      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to save bundle"));
      setIsSaving(false);
    }
  };

  const deleteBundle = async () => {
    if (!id) return;

    setIsSaving(true);
    setError(null);

    try {
      await api.bundle.delete(id);
      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete bundle"));
      setIsSaving(false);
    }
  };

  return (
    <s-page inlineSize="base">
      <s-section>
        <s-stack gap="large">
          <s-grid alignItems="center" gap="base" gridTemplateColumns="1fr auto">
            <s-stack direction="inline" alignItems="center" gap="small">
              {bundleCount ? (
                <s-button variant="tertiary" icon="arrow-left" onClick={() => navigate("/")}>
                  Bundles
                </s-button>
              ) : null}
              <s-heading>{id ? "Edit bundle" : "Create bundle"}</s-heading>
            </s-stack>

            {id ? (
              <s-button
                type="button"
                tone="critical"
                disabled={isSaving}
                onClick={() => void deleteBundle()}
              >
                Delete bundle
              </s-button>
            ) : null}
          </s-grid>
          {error ? (
            <s-banner tone="critical">
              <s-text>{error}</s-text>
            </s-banner>
          ) : null}

          <s-text-field
            label="Bundle title"
            value={title}
            onInput={(event) => setTitle(event.currentTarget.value)}
          />

          <s-number-field
            label={`Price${currency ? ` (${currency})` : ""}`}
            min={0}
            step={1}
            value={price}
            onInput={(event) => setPrice(event.currentTarget.value)}
          />

          <s-select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.currentTarget.value as BundleStatus)}
          >
            <s-option value="draft">Draft</s-option>
            <s-option value="active">Active</s-option>
            <s-option value="archived">Archived</s-option>
          </s-select>

          <s-text-area
            label="Description"
            value={description}
            onInput={(event) => setDescription(event.currentTarget.value)}
          />

          <BundleComponentsField
            bundleComponents={bundleComponents}
            onOpenPicker={() => void openPicker()}
            onRemove={(index) =>
              setBundleComponents((current) => removeBundleComponent(current, index))
            }
            onQuantityChange={(index, quantity) =>
              setBundleComponents((current) =>
                updateBundleComponentQuantity(current, index, quantity)
              )
            }
          />

          <s-button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={() => void saveBundle()}
          >
            {isSaving ? "Saving..." : id ? "Save bundle" : "Create bundle"}
          </s-button>
        </s-stack>
      </s-section>
    </s-page>
  );
}

type BundleComponentsFieldProps = {
  bundleComponents: BundleComponentFormValue[];
  onOpenPicker: () => void;
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
};

function BundleComponentsField({
  bundleComponents,
  onOpenPicker,
  onRemove,
  onQuantityChange,
}: BundleComponentsFieldProps) {
  return (
    <s-stack gap="small">
      <s-stack direction="inline" justifyContent="space-between" alignItems="center">
        <s-heading>Products in bundle</s-heading>
        <s-button type="button" onClick={onOpenPicker}>
          {bundleComponents.length ? "Edit variants" : "Select variants"}
        </s-button>
      </s-stack>

      {bundleComponents.length ? (
        <s-stack gap="small">
          {bundleComponents.map((component, index) => (
            <s-box
              key={component.productVariantId}
              border="base"
              padding="small"
              borderRadius="large-100"
            >
              <s-stack gap="small">
                <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                  <s-text>{component.displayName}</s-text>
                  <s-button
                    type="button"
                    variant="tertiary"
                    icon="x"
                    onClick={() => onRemove(index)}
                  />
                </s-stack>

                <s-number-field
                  label="Quantity"
                  min={1}
                  value={component.quantity.toString()}
                  onInput={(event) =>
                    onQuantityChange(index, Number(event.currentTarget.value))
                  }
                />
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      ) : (
        <s-box border="base" padding="small" borderRadius="large-100">
          <s-text tone="neutral">No variants selected yet.</s-text>
        </s-box>
      )}
    </s-stack>
  );
}
