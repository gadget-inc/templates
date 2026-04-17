import { useFindMany } from "@gadgetinc/react";
import { useDeferredValue, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { api } from "../api";
import { BundleCard } from "../components/BundleCard";
import { FullPageSpinner } from "../components/FullPageSpinner";

const NUM_ON_PAGE = 5;

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const [successBanner, setSuccessBanner] = useState<string | null>(
    () =>
      (location.state as { successBanner?: string } | null)?.successBanner ?? null
  );
  const [cursor, setCursor] = useState<{
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  }>({ first: NUM_ON_PAGE });

  const [{ data: bundles, fetching: fetchingBundles, error: bundlesError }] = useFindMany(api.shopifyProduct, {
    filter: {
      hasVariantsThatRequiresComponents: { equals: true },
    },
    select: {
      id: true,
      title: true,
      body: true,
      status: true,
      variants: {
        edges: {
          node: {
            id: true,
            price: true,
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
        },
      },
    },
    sort: {
      createdAt: "Descending",
    },
    live: true,
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
    const nextBanner = (location.state as { successBanner?: string } | null)?.successBanner ?? null;

    if (nextBanner) {
      setSuccessBanner(nextBanner);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

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
        {successBanner ? (
          <s-banner tone="success" dismissible onDismiss={() => setSuccessBanner(null)}>
            <s-text>{successBanner}</s-text>
          </s-banner>
        ) : null}

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
                <BundleCard key={bundle.id} bundle={bundle} />
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
