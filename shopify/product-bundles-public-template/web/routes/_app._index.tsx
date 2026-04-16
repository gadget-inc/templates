import { useFindMany } from "@gadgetinc/react";
import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { api } from "../api";
import { BundleCard } from "../components/BundleCard";
import { FullPageSpinner } from "../components/FullPageSpinner";
import type { OutletContext } from "./_app";

const NUM_ON_PAGE = 5;

export default function Index() {
  const { bundleCount } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const [cursor, setCursor] = useState<{
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  }>({ first: NUM_ON_PAGE });

  const [{ data: bundles, fetching: fetchingBundles, error: bundlesError }] = useFindMany(api.bundle, {
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      price: true,
      bundleComponentCount: true,
      bundleComponents: {
        edges: {
          node: {
            quantity: true,
            productVariant: {
              id: true,
              title: true,
              price: true,
              product: {
                id: true,
                title: true,
                media: {
                  edges: {
                    node: {
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    sort: {
      createdAt: "Descending",
    },
    ...cursor,
    ...(deferredSearchValue
      ? {
          search: deferredSearchValue,
          searchFields: {
            title: true,
          },
        }
      : {}),
  });

  useEffect(() => {
    setCursor({ first: NUM_ON_PAGE });
  }, [deferredSearchValue]);

  useEffect(() => {
    if (!bundleCount) {
      navigate("/bundle");
    }
  }, [bundleCount, navigate]);

  if (fetchingBundles && !bundles) {
    return <FullPageSpinner />;
  }

  if (bundlesError) {
    throw bundlesError;
  }

  return (
    <s-page inlineSize="base">
      <s-section>
        <s-stack gap="base">
          <s-grid alignItems="end" gap="base" gridTemplateColumns="1fr auto">
            <s-search-field
              label="Search bundles"
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              value={searchValue}
            />
            <s-button variant="primary" onClick={() => navigate("/bundle")}>
              Create bundle
            </s-button>
          </s-grid>

          {bundles?.length ? (
            <s-stack gap="base">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} {...bundle} />
              ))}
            </s-stack>
          ) : (
            <s-box>
              <s-text>No bundles found</s-text>
            </s-box>
          )}

          {(bundles?.hasNextPage || bundles?.hasPreviousPage) && (
            <s-stack direction="inline" gap="base" justifyContent="space-between">
              <s-button
                disabled={!bundles?.hasPreviousPage}
                onClick={() => setCursor({ last: NUM_ON_PAGE, before: bundles?.startCursor })}
              >
                Previous
              </s-button>
              <s-button
                disabled={!bundles?.hasNextPage}
                onClick={() => setCursor({ first: NUM_ON_PAGE, after: bundles?.endCursor })}
              >
                Next
              </s-button>
            </s-stack>
          )}
        </s-stack>
      </s-section>
    </s-page>
  );
}
