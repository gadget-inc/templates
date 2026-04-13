import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router";
import { api } from "../api";
import PageLayout from "../components/PageLayout";
import type { OutletContext } from "./_app";
import type { Route } from "./+types/_app.bundle.($id)";

type BundleComponentFormValue = {
  id?: string;
  productVariantId: string;
  quantity: number;
  productTitle: string;
  variantTitle: string;
};

type BundleStatus = "active" | "archived" | "draft";

type PickerVariant = {
  id: string;
  title?: string;
  product?: {
    title?: string;
  };
};

const stripShopifyGid = (gid: string) => gid.split("/").pop() ?? gid;

export const loader = async ({ context, params }: Route.LoaderArgs) => {
  let variants = await context.api.shopifyProductVariant.findMany({
    first: 250,
    select: {
      id: true,
      title: true,
      product: {
        title: true,
      },
    },
  });

  const allVariants = [...variants];

  while (variants.hasNextPage) {
    variants = await variants.nextPage();
    allVariants.push(...variants);
  }

  const variantMap: Record<string, { productTitle: string; variantTitle: string }> = {};

  for (const variant of allVariants) {
    variantMap[variant.id] = {
      productTitle: variant.product?.title || "Untitled product",
      variantTitle: variant.title || "Default Title",
    };
  }

  const bundle = params.id
    ? await context.api.bundle.findOne(params.id, {
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
      })
    : null;

  return { bundle, variantMap };
};

export default function BundleEditor() {
  const shopify = useAppBridge();
  const { id } = useParams();
  const { bundleCount } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const { bundle, variantMap } = useLoaderData<typeof loader>();

  const [title, setTitle] = useState(bundle?.title ?? "");
  const [price, setPrice] = useState(bundle?.price?.toString() ?? "0");
  const [status, setStatus] = useState<BundleStatus>((bundle?.status as BundleStatus | undefined) ?? "draft");
  const [description, setDescription] = useState(bundle?.description ?? "");
  const [bundleComponents, setBundleComponents] = useState<BundleComponentFormValue[]>(
    bundle?.bundleComponents?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is NonNullable<(typeof bundle.bundleComponents.edges)[number]>["node"] => Boolean(node?.productVariant?.id))
      .map((node) => ({
        id: node.id,
        productVariantId: node.productVariant!.id,
        quantity: Number(node.quantity ?? 1),
        productTitle: node.productVariant?.product?.title || "Untitled product",
        variantTitle: node.productVariant?.title || "Default Title",
      })) ?? []
  );
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

    const existingByVariantId = new Map(
      bundleComponents.map((component) => [component.productVariantId, component] as const)
    );

    setBundleComponents(
      selected.map((variant) => {
        const productVariantId = stripShopifyGid(variant.id);
        const existing = existingByVariantId.get(productVariantId);
        const fallback = variantMap[productVariantId];

        return {
          id: existing?.id,
          productVariantId,
          quantity: existing?.quantity ?? 1,
          productTitle: variant.product?.title || fallback?.productTitle || "Untitled product",
          variantTitle: variant.title || fallback?.variantTitle || "Default Title",
        };
      })
    );
  };

  const saveBundle = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        title,
        price: Number(price),
        status,
        description,
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
      };

      if (id) {
        await api.bundle.update(id, payload);
      } else {
        await api.bundle.create(payload);
      }

      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save bundle");
    } finally {
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
      setError(error instanceof Error ? error.message : "Failed to delete bundle");
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title={id ? "Edit Bundle" : "Create Bundle"}
      backAction={
        bundleCount
          ? {
              content: "Back",
              onAction: () => history.back(),
            }
          : undefined
      }
      primaryAction={
        id
          ? {
              content: "Delete bundle",
              tone: "critical",
              onAction: () => void deleteBundle(),
            }
          : undefined
      }
    >
      <s-box>
        <s-stack gap="large">
          {error ? (
            <s-banner tone="critical">
              <s-text>{error}</s-text>
            </s-banner>
          ) : null}

          <s-text-field
            label="Bundle title"
            value={title}
            onInput={(e) => setTitle((e.currentTarget as HTMLInputElement).value)}
          />

          <s-text-field
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onInput={(e) => setPrice((e.currentTarget as HTMLInputElement).value)}
          />

          <s-select
            label="Status"
            value={status}
            onChange={(e) => setStatus((e.currentTarget as HTMLSelectElement).value as BundleStatus)}
          >
            <s-option value="draft">Draft</s-option>
            <s-option value="active">Active</s-option>
            <s-option value="archived">Archived</s-option>
          </s-select>

          <s-text-area
            label="Description"
            value={description}
            onInput={(e) => setDescription((e.currentTarget as HTMLTextAreaElement).value)}
          />

          <s-stack gap="small">
            <s-stack direction="inline" justifyContent="space-between" alignItems="center">
              <s-heading>Products in bundle</s-heading>
              <s-button type="button" onClick={() => void openPicker()}>
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
                        <s-stack gap="none">
                          <s-text>{component.productTitle}</s-text>
                          {component.variantTitle !== "Default Title" ? (
                            <s-text tone="subdued">{component.variantTitle}</s-text>
                          ) : null}
                        </s-stack>
                        <s-button
                          type="button"
                          variant="tertiary"
                          icon="x"
                          onClick={() =>
                            setBundleComponents((current) =>
                              current.filter((_, currentIndex) => currentIndex !== index)
                            )
                          }
                        />
                      </s-stack>

                      <s-text-field
                        label="Quantity"
                        type="number"
                        min="1"
                        value={component.quantity.toString()}
                        onInput={(e) =>
                          setBundleComponents((current) =>
                            current.map((entry, currentIndex) =>
                              currentIndex === index
                                ? { ...entry, quantity: Number((e.currentTarget as HTMLInputElement).value) }
                                : entry
                            )
                          )
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

          <s-button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={() => void saveBundle()}
          >
            {isSaving ? "Saving..." : id ? "Save bundle" : "Create bundle"}
          </s-button>
        </s-stack>
      </s-box>
    </PageLayout>
  );
}
