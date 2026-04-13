import type { JSONValue } from "@gadget-client/product-bundles-public-template";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import type { OutletContext } from "../routes/_app";

const tones = {
  active: "success",
  archived: "info",
  draft: "warning",
} as const;

type BundleCardProps = {
  id: string;
  title: string;
  description: string | null;
  status: keyof typeof tones;
  price: number | null;
  bundleComponentCount: JSONValue | null;
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

const getBundleComponentCount = (value: JSONValue | null) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const getImageUrl = (value: JSONValue | null) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const originalSrc = value.originalSrc;
  return typeof originalSrc === "string" ? originalSrc : "";
};

export function BundleCard({
  id,
  title,
  description,
  status,
  price,
  bundleComponentCount,
  bundleComponents,
}: BundleCardProps) {
  const { currency } = useOutletContext<OutletContext>();
  const [open, setOpen] = useState(false);
  const componentCount = getBundleComponentCount(bundleComponentCount);

  const products = useMemo(() => {
    return Object.values(
      (bundleComponents?.edges ?? []).reduce<
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
  }, [bundleComponents]);

  return (
    <s-box>
      <s-stack gap="base">
        <s-grid gap="base" gridTemplateColumns="1fr auto">
          <s-stack gap="small">
            <s-stack alignItems="center" direction="inline" gap="small">
              <s-heading>{title}</s-heading>
              <s-badge tone={tones[status] ?? "warning"}>{status}</s-badge>
            </s-stack>
            <s-text>
              {price} {currency}
            </s-text>
          </s-stack>
          <s-link href={`bundle/${id}`}>Edit</s-link>
        </s-grid>

        <s-text>{description || "No description provided."}</s-text>
        <s-text>{componentCount} components</s-text>

        {open ? (
          <s-stack gap="small">
            {products.map((product) => (
              <s-grid gap="base" gridTemplateColumns="44px 1fr" key={product.id}>
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
                    <s-stack gap="small">
                      <s-text>
                        {product.variants[0]?.price
                          ? parseFloat(product.variants[0].price)
                            ? `${product.variants[0].price} ${currency}`
                            : "Free"
                          : ""}
                      </s-text>
                      <s-text>Quantity {product.variants[0]?.quantity ?? 0}</s-text>
                    </s-stack>
                  ) : (
                    <s-stack gap="small">
                      <s-grid gap="small" gridTemplateColumns="1fr auto">
                        <s-text>Variants</s-text>
                        <s-text>Quantity</s-text>
                      </s-grid>
                      {product.variants.map((variant) => (
                        <s-grid gap="small" gridTemplateColumns="1fr auto" key={variant.id}>
                          <s-stack gap="none">
                            <s-text>{variant.title}</s-text>
                            <s-text>
                              {variant.price
                                ? parseFloat(variant.price)
                                  ? `${variant.price} ${currency}`
                                  : "Free"
                                : ""}
                            </s-text>
                          </s-stack>
                          <s-text>{variant.quantity ?? 0}</s-text>
                        </s-grid>
                      ))}
                    </s-stack>
                  )}
                </s-stack>
              </s-grid>
            ))}
          </s-stack>
        ) : null}

        {componentCount > 0 ? (
          <s-stack alignItems="center">
            <s-button onClick={() => setOpen((current) => !current)}>
              {open ? "Less" : "More"}
            </s-button>
          </s-stack>
        ) : null}
      </s-stack>
    </s-box>
  );
}
