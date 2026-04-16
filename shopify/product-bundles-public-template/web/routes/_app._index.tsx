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
    <s-page heading="Bundles" inlineSize="base">
                <s-button variant="primary" slot="primary-action" onClick={() => navigate("/bundle")}>
            Create bundle
          </s-button>

      <s-section padding="none">
        <s-table
          paginate={bundles?.hasNextPage || bundles?.hasPreviousPage}
          hasPreviousPage={bundles?.hasPreviousPage}
          hasNextPage={bundles?.hasNextPage}
          onPreviousPage={() => setCursor({ last: NUM_ON_PAGE, before: bundles?.startCursor })}
          onNextPage={() => setCursor({ first: NUM_ON_PAGE, after: bundles?.endCursor })}
        >
          <s-search-field
            slot="filters"
            label="Search bundles"
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            value={searchValue}
          />
          <s-table-header-row>
            <s-table-header listSlot="primary">Bundle</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header format="currency">Price</s-table-header>
            <s-table-header />
          </s-table-header-row>
          <s-table-body>
            {bundles?.length ? (
              bundles.map((bundle) => (
                <BundleCard key={bundle.id} {...bundle} />
              ))
            ) : (
              <s-table-row>
                <s-table-cell>
                  <s-text tone="neutral">No bundles found</s-text>
                </s-table-cell>
                <s-table-cell />
                <s-table-cell />
                <s-table-cell />
              </s-table-row>
            )}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}
