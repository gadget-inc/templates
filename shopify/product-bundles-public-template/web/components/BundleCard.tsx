import type { JSONValue } from "@gadget-client/product-bundles-public-template";
import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import type { OutletContext } from "../routes/_app";

const tones = {
  active: "success",
  archived: "info",
  draft: "warning",
} as const;

type BundleStatus = keyof typeof tones;

type BundleVariant = {
  id: string;
  price: string | null;
  bundleComponents: {
    edges: {
      node: {
        quantity: number | null;
        productVariant: {
          id: string;
          title: string | null;
          price: string | null;
          product: {
            id: string;
            title: string | null;
            media: {
              edges: {
                node: {
                  image: JSONValue | null;
                };
              }[];
            };
          } | null;
        } | null;
      };
    }[];
  } | null;
};

type BundleProduct = {
  id: string;
  title: string | null;
  body: string | null;
  status: string | null;
  variants: {
    edges: {
      node: BundleVariant;
    }[];
  } | null;
};

type BundleCardProps = {
  bundle: BundleProduct;
};

const getImageUrl = (value: JSONValue | null) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const originalSrc = value.originalSrc;
  return typeof originalSrc === "string" ? originalSrc : "";
};

export function BundleCard({ bundle }: BundleCardProps) {
  const { currency } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const bundleVariant = bundle.variants?.edges?.[0]?.node ?? null;
  const componentEdges = bundleVariant?.bundleComponents?.edges ?? [];
  const componentCount = componentEdges.length;
  const status = (bundle.status?.toLowerCase() ?? "draft") as BundleStatus;
  const price = bundleVariant?.price ? parseFloat(bundleVariant.price) : null;

  const products = useMemo(() => {
    return Object.values(
      componentEdges.reduce<
        Record<
          string,
          {
            id: string;
            title: string;
            imageUrl: string;
            variants: {
              id: string;
              title: string;
              quantity: number | null;
              price: string | null;
            }[];
          }
        >
      >((acc, { node }) => {
        const product = node.productVariant?.product;
        if (!product?.id) return acc;

        const image = product.media?.edges?.[0]?.node?.image;
        if (!acc[product.id]) {
          acc[product.id] = {
            id: product.id,
            title: product.title ?? "Untitled product",
            imageUrl: getImageUrl(image),
            variants: [],
          };
        }

        acc[product.id].variants.push({
          id: node.productVariant?.id ?? product.id,
          title: node.productVariant?.title ?? "Default title",
          quantity: node.quantity,
          price: node.productVariant?.price ?? null,
        });

        return acc;
      }, {})
    );
  }, [componentEdges]);

  const formattedPrice = price !== null ? `${price.toFixed(2)} ${currency}` : "—";

  return (
    <>
      <s-table-row {...(componentCount > 0 ? { onClick: () => setOpen((c) => !c) } : {}) as {}}>
        <s-table-cell>
          <s-stack direction="inline" gap="small" alignItems="center">
            <s-text>{bundle.title}</s-text>
            {componentCount > 0 && (
              <s-button
                variant="tertiary"
                icon={open ? "chevron-up" : "chevron-down"}
                onClick={(e) => { e.stopPropagation(); setOpen((c) => !c); }}
              />
            )}
          </s-stack>
        </s-table-cell>
        <s-table-cell>
          <s-badge tone={tones[status] ?? "warning"}>{status}</s-badge>
        </s-table-cell>
        <s-table-cell>{formattedPrice}</s-table-cell>
        <s-table-cell>
          <s-button onClick={(e) => { e.stopPropagation(); navigate(`/bundle/${bundle.id}`); }}>Edit</s-button>
        </s-table-cell>
      </s-table-row>

      {open && products.length > 0 && (
        <s-table-row>
          <s-table-cell>
            <s-stack gap="small">
              {products.map((product) => (
                <s-grid gap="base" gridTemplateColumns="44px 1fr" key={product.id} alignItems="center">
                  <s-box background="subdued" blockSize="44px" borderRadius="base" inlineSize="44px" overflow="hidden">
                    <s-image
                      alt={product.title}
                      aspectRatio="1/1"
                      inlineSize="fill"
                      loading="lazy"
                      objectFit="cover"
                      src={product.imageUrl}
                    />
                  </s-box>

                  <s-stack gap="small">
                    <s-text>{product.title}</s-text>
                    {product.variants.length === 1 ? (
                      <s-stack direction="inline" gap="base">
                        <s-text tone="neutral">
                          {product.variants[0]?.price
                            ? parseFloat(product.variants[0].price)
                              ? `${product.variants[0].price} ${currency}`
                              : "Free"
                            : ""}
                        </s-text>
                        <s-text tone="neutral">Qty {product.variants[0]?.quantity ?? 0}</s-text>
                      </s-stack>
                    ) : (
                      <s-stack gap="small">
                        {product.variants.map((variant) => (
                          <s-grid gap="small" gridTemplateColumns="1fr auto auto" key={variant.id}>
                            <s-text>{variant.title}</s-text>
                            <s-text tone="neutral">
                              {variant.price
                                ? parseFloat(variant.price)
                                  ? `${variant.price} ${currency}`
                                  : "Free"
                                : ""}
                            </s-text>
                            <s-text tone="neutral">Qty {variant.quantity ?? 0}</s-text>
                          </s-grid>
                        ))}
                      </s-stack>
                    )}
                  </s-stack>
                </s-grid>
              ))}
            </s-stack>
          </s-table-cell>
          <s-table-cell />
          <s-table-cell />
          <s-table-cell />
        </s-table-row>
      )}
    </>
  );
}
